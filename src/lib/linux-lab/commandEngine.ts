import { VirtualFileSystem, VFSNode } from './vfs';

export interface CommandOutput {
  stdout: string;
  stderr: string;
  exitCode: number;
}

export class LinuxCommandEngine {
  vfs: VirtualFileSystem;
  history: string[] = [];
  lastDir: string = '/home/sai';

  constructor(vfs: VirtualFileSystem) {
    this.vfs = vfs;
  }

  // Execute full command line string (with support for pipes and redirection)
  executeCommandLine(cmdLine: string): CommandOutput {
    const trimmed = cmdLine.trim();
    if (!trimmed) return { stdout: '', stderr: '', exitCode: 0 };
    if (trimmed.startsWith('#')) return { stdout: '', stderr: '', exitCode: 0 };

    this.history.push(trimmed);

    // Check for redirection: > or >>
    let redirectMode: 'none' | 'write' | 'append' = 'none';
    let redirectTarget = '';
    let commandToRun = trimmed;

    if (trimmed.includes('>>')) {
      const parts = trimmed.split('>>');
      commandToRun = parts[0].trim();
      redirectTarget = parts.slice(1).join('>>').trim();
      redirectMode = 'append';
    } else if (trimmed.includes('>') && !trimmed.includes('2>')) {
      const parts = trimmed.split('>');
      commandToRun = parts[0].trim();
      redirectTarget = parts.slice(1).join('>').trim();
      redirectMode = 'write';
    }

    // Check for pipelines: cmd1 | cmd2 | cmd3
    const pipeCommands = commandToRun.split('|').map((s) => s.trim()).filter(Boolean);
    let currentInput = '';
    let finalResult: CommandOutput = { stdout: '', stderr: '', exitCode: 0 };

    for (let i = 0; i < pipeCommands.length; i++) {
      const singleCmd = pipeCommands[i];
      finalResult = this.executeSingleCommand(singleCmd, currentInput);
      if (finalResult.exitCode !== 0) {
        break;
      }
      currentInput = finalResult.stdout;
    }

    // Apply file redirection if requested
    if (redirectMode !== 'none' && redirectTarget) {
      const cleanTarget = redirectTarget.replace(/^["']|["']$/g, '');
      const { parent, basename } = this.vfs.getParentNode(cleanTarget);
      if (!parent || parent.type !== 'directory') {
        return {
          stdout: '',
          stderr: `bash: ${cleanTarget}: No such file or directory\n`,
          exitCode: 1,
        };
      }
      if (!parent.children) parent.children = new Map();

      let targetNode = parent.children.get(basename);
      if (targetNode && targetNode.type === 'directory') {
        return {
          stdout: '',
          stderr: `bash: ${cleanTarget}: Is a directory\n`,
          exitCode: 1,
        };
      }

      if (redirectMode === 'write') {
        parent.children.set(basename, {
          name: basename,
          type: 'file',
          content: finalResult.stdout,
          permissions: 0o644,
          owner: this.vfs.currentUser,
          group: this.vfs.currentGroup,
          size: finalResult.stdout.length,
          modified: new Date(),
        });
      } else if (redirectMode === 'append') {
        const existing = targetNode?.content || '';
        const newContent = existing + (existing && !existing.endsWith('\n') ? '\n' : '') + finalResult.stdout;
        parent.children.set(basename, {
          name: basename,
          type: 'file',
          content: newContent,
          permissions: targetNode?.permissions || 0o644,
          owner: targetNode?.owner || this.vfs.currentUser,
          group: targetNode?.group || this.vfs.currentGroup,
          size: newContent.length,
          modified: new Date(),
        });
      }

      return { stdout: '', stderr: finalResult.stderr, exitCode: finalResult.exitCode };
    }

    return finalResult;
  }

  // Parse arguments handling quotes
  private parseArgs(cmdStr: string): string[] {
    const regex = /[^\s"']+|"([^"]*)"|'([^']*)'/g;
    const args: string[] = [];
    let match: RegExpExecArray | null;
    while ((match = regex.exec(cmdStr)) !== null) {
      if (match[1] !== undefined) {
        args.push(match[1]);
      } else if (match[2] !== undefined) {
        args.push(match[2]);
      } else {
        args.push(match[0]);
      }
    }
    return args;
  }

  // Single command execution with optional piped stdin
  private executeSingleCommand(cmdStr: string, stdinText: string = ''): CommandOutput {
    // Variable substitution like $USER or $PORT
    let expanded = cmdStr.replace(/\$([A-Z0-9_]+)/gi, (_, varName) => {
      if (varName === '?') return '0';
      return this.vfs.env.get(varName) || '';
    });

    const tokens = this.parseArgs(expanded);
    if (tokens.length === 0) return { stdout: '', stderr: '', exitCode: 0 };

    const cmd = tokens[0];
    const rawArgs = tokens.slice(1);

    // Variable assignment: e.g. NAME="sai"
    if (tokens.length === 1 && cmd.includes('=') && !cmd.startsWith('=')) {
      const [k, ...vParts] = cmd.split('=');
      const val = vParts.join('=').replace(/^["']|["']$/g, '');
      this.vfs.env.set(k, val);
      return { stdout: '', stderr: '', exitCode: 0 };
    }

    switch (cmd) {
      case 'pwd':
        return { stdout: this.vfs.currentPath + '\n', stderr: '', exitCode: 0 };

      case 'whoami':
        return { stdout: this.vfs.currentUser + '\n', stderr: '', exitCode: 0 };

      case 'uname':
        if (rawArgs.includes('-a')) {
          return {
            stdout: 'Linux linux-lab 6.8.0-40-generic #40-Ubuntu SMP PREEMPT_DYNAMIC Mon Jun 10 18:00:00 UTC 2026 x86_64 x86_64 x86_64 GNU/Linux\n',
            stderr: '',
            exitCode: 0,
          };
        }
        return { stdout: 'Linux\n', stderr: '', exitCode: 0 };

      case 'date':
        return { stdout: new Date().toUTCString() + '\n', stderr: '', exitCode: 0 };

      case 'clear':
        return { stdout: '\x1b[2J\x1b[3J\x1b[H', stderr: '', exitCode: 0 };

      case 'history':
        return {
          stdout: this.history.map((h, i) => `  ${(i + 1).toString().padStart(4, ' ')}  ${h}`).join('\n') + '\n',
          stderr: '',
          exitCode: 0,
        };

      case 'export': {
        if (rawArgs.length === 0) {
          const list = Array.from(this.vfs.env.entries())
            .map(([k, v]) => `declare -x ${k}="${v}"`)
            .join('\n');
          return { stdout: list + '\n', stderr: '', exitCode: 0 };
        }
        for (const arg of rawArgs) {
          if (arg.includes('=')) {
            const [k, ...v] = arg.split('=');
            this.vfs.env.set(k, v.join('=').replace(/^["']|["']$/g, ''));
          }
        }
        return { stdout: '', stderr: '', exitCode: 0 };
      }

      case 'cd': {
        const target = rawArgs[0] || '~';
        if (target === '-') {
          const prev = this.lastDir;
          this.lastDir = this.vfs.currentPath;
          this.vfs.currentPath = prev;
          return { stdout: prev + '\n', stderr: '', exitCode: 0 };
        }
        const resolved = this.vfs.normalizePath(target);
        const node = this.vfs.resolvePathNode(resolved);
        if (!node) {
          return { stdout: '', stderr: `bash: cd: ${target}: No such file or directory\n`, exitCode: 1 };
        }
        if (node.type !== 'directory') {
          return { stdout: '', stderr: `bash: cd: ${target}: Not a directory\n`, exitCode: 1 };
        }
        this.lastDir = this.vfs.currentPath;
        this.vfs.currentPath = resolved;
        return { stdout: '', stderr: '', exitCode: 0 };
      }

      case 'ls': {
        let showAll = false;
        let showLong = false;
        const targets: string[] = [];

        for (const a of rawArgs) {
          if (a.startsWith('-')) {
            if (a.includes('a')) showAll = true;
            if (a.includes('l')) showLong = true;
          } else {
            targets.push(a);
          }
        }

        const targetPath = targets[0] || this.vfs.currentPath;
        const node = this.vfs.resolvePathNode(targetPath);
        if (!node) {
          return { stdout: '', stderr: `ls: cannot access '${targetPath}': No such file or directory\n`, exitCode: 2 };
        }

        if (node.type === 'file') {
          if (showLong) {
            const perms = VirtualFileSystem.formatPermissions(node.permissions, false);
            const dateStr = node.modified.toLocaleDateString('en-US', { month: 'short', day: '2-digit' });
            return { stdout: `${perms} 1 ${node.owner} ${node.group} ${node.size.toString().padStart(6)} ${dateStr} ${node.name}\n`, stderr: '', exitCode: 0 };
          }
          return { stdout: node.name + '\n', stderr: '', exitCode: 0 };
        }

        const entries: VFSNode[] = [];
        if (showAll) {
          entries.push({
            name: '.',
            type: 'directory',
            permissions: node.permissions,
            owner: node.owner,
            group: node.group,
            size: 4096,
            modified: node.modified,
          });
          entries.push({
            name: '..',
            type: 'directory',
            permissions: 0o755,
            owner: 'root',
            group: 'root',
            size: 4096,
            modified: node.modified,
          });
        }

        if (node.children) {
          for (const [name, child] of node.children.entries()) {
            if (!showAll && name.startsWith('.')) continue;
            entries.push(child);
          }
        }

        entries.sort((a, b) => a.name.localeCompare(b.name));

        if (showLong) {
          const totalBlocks = Math.ceil(entries.reduce((acc, c) => acc + (c.type === 'directory' ? 4 : Math.max(4, Math.ceil(c.size / 1024) * 4)), 0));
          const lines = [`total ${totalBlocks}`];
          for (const item of entries) {
            const isDir = item.type === 'directory';
            const permStr = VirtualFileSystem.formatPermissions(item.permissions, isDir);
            const sizeStr = (isDir ? 4096 : item.size).toString().padStart(6);
            const dateStr = item.modified.toLocaleDateString('en-US', { month: 'short', day: '2-digit' });
            const coloredName = isDir ? `\x1b[1;34m${item.name}\x1b[0m` : (item.permissions & 0o111 ? `\x1b[1;32m${item.name}\x1b[0m` : item.name);
            lines.push(`${permStr} 1 ${item.owner} ${item.group} ${sizeStr} ${dateStr} ${coloredName}`);
          }
          return { stdout: lines.join('\n') + '\n', stderr: '', exitCode: 0 };
        }

        const names = entries.map((item) => {
          if (item.type === 'directory') return `\x1b[1;34m${item.name}\x1b[0m`;
          if (item.permissions & 0o111) return `\x1b[1;32m${item.name}\x1b[0m`;
          return item.name;
        });
        return { stdout: names.join('  ') + (names.length ? '\n' : ''), stderr: '', exitCode: 0 };
      }

      case 'mkdir': {
        let makeParents = false;
        const dirs: string[] = [];
        for (const a of rawArgs) {
          if (a === '-p') makeParents = true;
          else if (!a.startsWith('-')) dirs.push(a);
        }
        if (dirs.length === 0) {
          return { stdout: '', stderr: 'mkdir: missing operand\n', exitCode: 1 };
        }

        for (const dirPath of dirs) {
          if (makeParents) {
            const normalized = this.vfs.normalizePath(dirPath);
            const parts = normalized.split('/').filter(Boolean);
            let curr = this.vfs.root;
            for (const p of parts) {
              if (!curr.children) curr.children = new Map();
              let next = curr.children.get(p);
              if (!next) {
                next = {
                  name: p,
                  type: 'directory',
                  permissions: 0o755,
                  owner: this.vfs.currentUser,
                  group: this.vfs.currentGroup,
                  size: 4096,
                  modified: new Date(),
                  children: new Map(),
                };
                curr.children.set(p, next);
              } else if (next.type !== 'directory') {
                return { stdout: '', stderr: `mkdir: cannot create directory '${dirPath}': File exists\n`, exitCode: 1 };
              }
              curr = next;
            }
          } else {
            const { parent, basename } = this.vfs.getParentNode(dirPath);
            if (!parent || parent.type !== 'directory') {
              return { stdout: '', stderr: `mkdir: cannot create directory '${dirPath}': No such file or directory\n`, exitCode: 1 };
            }
            if (!parent.children) parent.children = new Map();
            if (parent.children.has(basename)) {
              return { stdout: '', stderr: `mkdir: cannot create directory '${dirPath}': File exists\n`, exitCode: 1 };
            }
            parent.children.set(basename, {
              name: basename,
              type: 'directory',
              permissions: 0o755,
              owner: this.vfs.currentUser,
              group: this.vfs.currentGroup,
              size: 4096,
              modified: new Date(),
              children: new Map(),
            });
          }
        }
        return { stdout: '', stderr: '', exitCode: 0 };
      }

      case 'touch': {
        const files = rawArgs.filter((a) => !a.startsWith('-'));
        if (files.length === 0) {
          return { stdout: '', stderr: 'touch: missing file operand\n', exitCode: 1 };
        }
        for (const f of files) {
          const { parent, basename } = this.vfs.getParentNode(f);
          if (!parent || parent.type !== 'directory') {
            return { stdout: '', stderr: `touch: cannot touch '${f}': No such file or directory\n`, exitCode: 1 };
          }
          if (!parent.children) parent.children = new Map();
          const existing = parent.children.get(basename);
          if (existing) {
            existing.modified = new Date();
          } else {
            parent.children.set(basename, {
              name: basename,
              type: 'file',
              content: '',
              permissions: 0o644,
              owner: this.vfs.currentUser,
              group: this.vfs.currentGroup,
              size: 0,
              modified: new Date(),
            });
          }
        }
        return { stdout: '', stderr: '', exitCode: 0 };
      }

      case 'cat': {
        const files = rawArgs.filter((a) => !a.startsWith('-'));
        if (files.length === 0) {
          if (stdinText) return { stdout: stdinText, stderr: '', exitCode: 0 };
          return { stdout: '', stderr: '', exitCode: 0 };
        }
        let out = '';
        for (const f of files) {
          const node = this.vfs.resolvePathNode(f);
          if (!node) {
            return { stdout: '', stderr: `cat: ${f}: No such file or directory\n`, exitCode: 1 };
          }
          if (node.type === 'directory') {
            return { stdout: '', stderr: `cat: ${f}: Is a directory\n`, exitCode: 1 };
          }
          out += node.content || '';
          if (out && !out.endsWith('\n')) out += '\n';
        }
        return { stdout: out, stderr: '', exitCode: 0 };
      }

      case 'head': {
        let linesCount = 10;
        const files: string[] = [];
        for (let i = 0; i < rawArgs.length; i++) {
          if (rawArgs[i] === '-n' && rawArgs[i + 1]) {
            linesCount = parseInt(rawArgs[i + 1], 10) || 10;
            i++;
          } else if (rawArgs[i].startsWith('-') && /^\d+$/.test(rawArgs[i].slice(1))) {
            linesCount = parseInt(rawArgs[i].slice(1), 10) || 10;
          } else {
            files.push(rawArgs[i]);
          }
        }

        const source = files.length > 0 ? (this.vfs.resolvePathNode(files[0])?.content || '') : stdinText;
        const lines = source.split('\n');
        const selected = lines.slice(0, linesCount).join('\n') + '\n';
        return { stdout: selected, stderr: '', exitCode: 0 };
      }

      case 'tail': {
        let linesCount = 10;
        const files: string[] = [];
        for (let i = 0; i < rawArgs.length; i++) {
          if (rawArgs[i] === '-n' && rawArgs[i + 1]) {
            linesCount = parseInt(rawArgs[i + 1], 10) || 10;
            i++;
          } else if (rawArgs[i].startsWith('-') && /^\d+$/.test(rawArgs[i].slice(1))) {
            linesCount = parseInt(rawArgs[i].slice(1), 10) || 10;
          } else {
            files.push(rawArgs[i]);
          }
        }

        const source = files.length > 0 ? (this.vfs.resolvePathNode(files[0])?.content || '') : stdinText;
        const lines = source.split('\n');
        const selected = lines.slice(-linesCount).join('\n') + '\n';
        return { stdout: selected, stderr: '', exitCode: 0 };
      }

      case 'grep': {
        let ignoreCase = false;
        let invert = false;
        let lineNumbers = false;
        let pattern = '';
        const files: string[] = [];

        for (let i = 0; i < rawArgs.length; i++) {
          const a = rawArgs[i];
          if (a.startsWith('-')) {
            if (a.includes('i')) ignoreCase = true;
            if (a.includes('v')) invert = true;
            if (a.includes('n')) lineNumbers = true;
          } else if (!pattern) {
            pattern = a;
          } else {
            files.push(a);
          }
        }

        if (!pattern) {
          return { stdout: '', stderr: 'Usage: grep [OPTION]... PATTERNS [FILE]...\n', exitCode: 2 };
        }

        let input = stdinText;
        if (files.length > 0) {
          const node = this.vfs.resolvePathNode(files[0]);
          if (!node) {
            return { stdout: '', stderr: `grep: ${files[0]}: No such file or directory\n`, exitCode: 2 };
          }
          if (node.type === 'directory') {
            return { stdout: '', stderr: `grep: ${files[0]}: Is a directory\n`, exitCode: 2 };
          }
          input = node.content || '';
        }

        const lines = input.split('\n');
        const regex = new RegExp(pattern, ignoreCase ? 'i' : '');
        const matched: string[] = [];

        lines.forEach((line, idx) => {
          if (!line && idx === lines.length - 1) return;
          const isMatch = regex.test(line);
          if (invert ? !isMatch : isMatch) {
            matched.push(lineNumbers ? `${idx + 1}:${line}` : line);
          }
        });

        return {
          stdout: matched.length > 0 ? matched.join('\n') + '\n' : '',
          stderr: '',
          exitCode: matched.length > 0 ? 0 : 1,
        };
      }

      case 'find': {
        const searchPath = rawArgs.find((a) => !a.startsWith('-')) || '.';
        const startNode = this.vfs.resolvePathNode(searchPath);
        if (!startNode) {
          return { stdout: '', stderr: `find: '${searchPath}': No such file or directory\n`, exitCode: 1 };
        }

        let namePattern: RegExp | null = null;
        let typeFilter: 'f' | 'd' | null = null;

        for (let i = 0; i < rawArgs.length; i++) {
          if (rawArgs[i] === '-name' && rawArgs[i + 1]) {
            const rawPat = rawArgs[i + 1].replace(/\*/g, '.*').replace(/\?/g, '.');
            namePattern = new RegExp(`^${rawPat}$`);
            i++;
          } else if (rawArgs[i] === '-type' && rawArgs[i + 1]) {
            typeFilter = rawArgs[i + 1] === 'f' ? 'f' : rawArgs[i + 1] === 'd' ? 'd' : null;
            i++;
          }
        }

        const results: string[] = [];
        const traverse = (node: VFSNode, curRel: string) => {
          let matches = true;
          if (namePattern && !namePattern.test(node.name || curRel)) matches = false;
          if (typeFilter === 'f' && node.type !== 'file') matches = false;
          if (typeFilter === 'd' && node.type !== 'directory') matches = false;

          if (matches) results.push(curRel);

          if (node.type === 'directory' && node.children) {
            for (const [childName, childNode] of node.children.entries()) {
              const nextRel = curRel === '.' ? `./${childName}` : `${curRel}/${childName}`;
              traverse(childNode, nextRel);
            }
          }
        };

        traverse(startNode, searchPath);
        return { stdout: results.join('\n') + (results.length ? '\n' : ''), stderr: '', exitCode: 0 };
      }

      case 'chmod': {
        if (rawArgs.length < 2) {
          return { stdout: '', stderr: 'chmod: missing operand\n', exitCode: 1 };
        }
        const modeStr = rawArgs[0];
        const targetPath = rawArgs[1];
        const node = this.vfs.resolvePathNode(targetPath);
        if (!node) {
          return { stdout: '', stderr: `chmod: cannot access '${targetPath}': No such file or directory\n`, exitCode: 1 };
        }

        const numeric = VirtualFileSystem.parseNumericChmod(modeStr);
        if (numeric !== null) {
          node.permissions = numeric;
          return { stdout: '', stderr: '', exitCode: 0 };
        }

        // Symbolic e.g. +x or u+x or a+x
        if (modeStr.includes('+x')) {
          node.permissions = node.permissions | 0o111;
          return { stdout: '', stderr: '', exitCode: 0 };
        }
        if (modeStr.includes('-x')) {
          node.permissions = node.permissions & ~0o111;
          return { stdout: '', stderr: '', exitCode: 0 };
        }

        return { stdout: '', stderr: `chmod: invalid mode: '${modeStr}'\n`, exitCode: 1 };
      }

      case 'chown': {
        if (rawArgs.length < 2) {
          return { stdout: '', stderr: 'chown: missing operand\n', exitCode: 1 };
        }
        const userGroup = rawArgs[0];
        const targetPath = rawArgs[1];
        const node = this.vfs.resolvePathNode(targetPath);
        if (!node) {
          return { stdout: '', stderr: `chown: cannot access '${targetPath}': No such file or directory\n`, exitCode: 1 };
        }
        const [u, g] = userGroup.split(':');
        if (u) node.owner = u;
        if (g) node.group = g;
        return { stdout: '', stderr: '', exitCode: 0 };
      }

      case 'cp': {
        const isRec = rawArgs.includes('-r') || rawArgs.includes('-R');
        const paths = rawArgs.filter((a) => !a.startsWith('-'));
        if (paths.length < 2) {
          return { stdout: '', stderr: 'cp: missing file operand\n', exitCode: 1 };
        }
        const srcNode = this.vfs.resolvePathNode(paths[0]);
        if (!srcNode) {
          return { stdout: '', stderr: `cp: cannot stat '${paths[0]}': No such file or directory\n`, exitCode: 1 };
        }
        if (srcNode.type === 'directory' && !isRec) {
          return { stdout: '', stderr: `cp: -r not specified; omitting directory '${paths[0]}'\n`, exitCode: 1 };
        }

        const destPath = paths[1];
        const destNode = this.vfs.resolvePathNode(destPath);
        if (destNode && destNode.type === 'directory') {
          if (!destNode.children) destNode.children = new Map();
          destNode.children.set(srcNode.name, JSON.parse(JSON.stringify(srcNode)));
          return { stdout: '', stderr: '', exitCode: 0 };
        }

        const { parent, basename } = this.vfs.getParentNode(destPath);
        if (!parent || parent.type !== 'directory') {
          return { stdout: '', stderr: `cp: cannot create regular file '${destPath}': No such file or directory\n`, exitCode: 1 };
        }
        if (!parent.children) parent.children = new Map();
        const clone = JSON.parse(JSON.stringify(srcNode));
        clone.name = basename;
        parent.children.set(basename, clone);
        return { stdout: '', stderr: '', exitCode: 0 };
      }

      case 'mv': {
        const paths = rawArgs.filter((a) => !a.startsWith('-'));
        if (paths.length < 2) {
          return { stdout: '', stderr: 'mv: missing file operand\n', exitCode: 1 };
        }
        const { parent: srcParent, basename: srcName } = this.vfs.getParentNode(paths[0]);
        const srcNode = srcParent?.children?.get(srcName);
        if (!srcNode || !srcParent) {
          return { stdout: '', stderr: `mv: cannot stat '${paths[0]}': No such file or directory\n`, exitCode: 1 };
        }

        const destPath = paths[1];
        const destNode = this.vfs.resolvePathNode(destPath);
        if (destNode && destNode.type === 'directory') {
          if (!destNode.children) destNode.children = new Map();
          destNode.children.set(srcNode.name, srcNode);
          srcParent.children?.delete(srcName);
          return { stdout: '', stderr: '', exitCode: 0 };
        }

        const { parent: destParent, basename: destName } = this.vfs.getParentNode(destPath);
        if (!destParent || destParent.type !== 'directory') {
          return { stdout: '', stderr: `mv: cannot move '${paths[0]}' to '${destPath}': No such file or directory\n`, exitCode: 1 };
        }
        if (!destParent.children) destParent.children = new Map();
        srcNode.name = destName;
        destParent.children.set(destName, srcNode);
        srcParent.children?.delete(srcName);
        return { stdout: '', stderr: '', exitCode: 0 };
      }

      case 'rm': {
        const isRec = rawArgs.includes('-r') || rawArgs.includes('-R') || rawArgs.includes('-rf');
        const paths = rawArgs.filter((a) => !a.startsWith('-'));
        if (paths.length === 0) {
          return { stdout: '', stderr: 'rm: missing operand\n', exitCode: 1 };
        }
        for (const p of paths) {
          const { parent, basename } = this.vfs.getParentNode(p);
          const node = parent?.children?.get(basename);
          if (!node) {
            if (!rawArgs.includes('-f') && !rawArgs.includes('-rf')) {
              return { stdout: '', stderr: `rm: cannot remove '${p}': No such file or directory\n`, exitCode: 1 };
            }
            continue;
          }
          if (node.type === 'directory' && !isRec) {
            return { stdout: '', stderr: `rm: cannot remove '${p}': Is a directory\n`, exitCode: 1 };
          }
          parent?.children?.delete(basename);
        }
        return { stdout: '', stderr: '', exitCode: 0 };
      }

      case 'ps': {
        const isAux = rawArgs.includes('aux') || rawArgs.includes('-ef');
        const lines = ['USER         PID %CPU %MEM    VSZ   RSS TTY      STAT START   TIME COMMAND'];
        for (const p of this.vfs.processes) {
          lines.push(
            `${p.user.padEnd(9)} ${p.pid.toString().padStart(5)}  ${p.cpu.toFixed(1).padStart(4)}  ${p.mem.toFixed(1).padStart(4)}  ${(p.pid * 2100).toString().padStart(6)} ${(p.pid * 840).toString().padStart(5)} pts/0    ${p.status}    ${p.startTime}   0:00 ${p.command}`
          );
        }
        return { stdout: lines.join('\n') + '\n', stderr: '', exitCode: 0 };
      }

      case 'kill': {
        const pids = rawArgs.filter((a) => !a.startsWith('-')).map((p) => parseInt(p, 10));
        if (pids.length === 0) {
          return { stdout: '', stderr: 'kill: usage: kill [-s sigspec | -n signum | -sigspec] pid | jobspec ...\n', exitCode: 1 };
        }
        for (const pid of pids) {
          const idx = this.vfs.processes.findIndex((p) => p.pid === pid);
          if (idx === -1) {
            return { stdout: '', stderr: `bash: kill: (${pid}) - No such process\n`, exitCode: 1 };
          }
          this.vfs.processes.splice(idx, 1);
        }
        return { stdout: '', stderr: '', exitCode: 0 };
      }

      case 'df': {
        const out = `Filesystem     1K-blocks      Used Available Use% Mounted on\n/dev/root       40176484  14285120  24283288  38% /\ntmpfs            4041280         0   4041280   0% /dev/shm\n/dev/sda1         523248     12432    510816   3% /boot/efi\n`;
        return { stdout: out, stderr: '', exitCode: 0 };
      }

      case 'du': {
        const target = rawArgs.find((a) => !a.startsWith('-')) || '.';
        const out = `4.0K\t${target}/scripts\n12K\t${target}/logs\n88K\t${target}/projects/app\n104K\t${target}/projects\n128K\t${target}\n`;
        return { stdout: out, stderr: '', exitCode: 0 };
      }

      case 'free': {
        const out = `               total        used        free      shared  buff/cache   available\nMem:         8082560     2412850     3841290       12040     1828420     5657670\nSwap:        2097148           0     2097148\n`;
        return { stdout: out, stderr: '', exitCode: 0 };
      }

      case 'ip': {
        const sub = rawArgs[0] || 'a';
        if (sub === 'a' || sub === 'addr' || sub === 'address') {
          const out = `1: lo: <LOOPBACK,UP,LOWER_UP> mtu 65536 qdisc noqueue state UNKNOWN group default qlen 1000\n    link/loopback 00:00:00:00:00:00 brd 00:00:00:00:00:00\n    inet 127.0.0.1/8 scope host lo\n       valid_lft forever preferred_lft forever\n2: eth0: <BROADCAST,MULTICAST,UP,LOWER_UP> mtu 1500 qdisc mq state UP group default qlen 1000\n    link/ether 02:42:0a:00:04:78 brd ff:ff:ff:ff:ff:ff\n    inet 10.0.4.120/24 brd 10.0.4.255 scope global eth0\n       valid_lft forever preferred_lft forever\n`;
          return { stdout: out, stderr: '', exitCode: 0 };
        }
        if (sub === 'route' || sub === 'r') {
          return { stdout: 'default via 10.0.4.1 dev eth0 proto dhcp src 10.0.4.120 metric 100\n10.0.4.0/24 dev eth0 proto kernel scope link src 10.0.4.120 metric 100\n', stderr: '', exitCode: 0 };
        }
        return { stdout: 'ip: use `ip addr` or `ip route`\n', stderr: '', exitCode: 0 };
      }

      case 'ping': {
        const host = rawArgs.find((a) => !a.startsWith('-')) || 'localhost';
        const out = `PING ${host} (${host === 'localhost' ? '127.0.0.1' : '8.8.8.8'}) 56(84) bytes of data.\n64 bytes from ${host}: icmp_seq=1 ttl=118 time=12.4 ms\n64 bytes from ${host}: icmp_seq=2 ttl=118 time=11.9 ms\n64 bytes from ${host}: icmp_seq=3 ttl=118 time=12.1 ms\n\n--- ${host} ping statistics ---\n3 packets transmitted, 3 received, 0% packet loss, time 2003ms\nrtt min/avg/max/mdev = 11.912/12.133/12.411/0.208 ms\n`;
        return { stdout: out, stderr: '', exitCode: 0 };
      }

      case 'ss': {
        const out = `Netid State  Recv-Q Send-Q Local Address:Port  Peer Address:PortProcess\ntcp   LISTEN 0      128          0.0.0.0:22         0.0.0.0:*    users:(("sshd",pid=114,fd=3))\ntcp   LISTEN 0      511          0.0.0.0:80         0.0.0.0:*    users:(("nginx",pid=340,fd=6))\ntcp   LISTEN 0      511        127.0.0.1:8080       0.0.0.0:*    users:(("node",pid=1204,fd=18))\n`;
        return { stdout: out, stderr: '', exitCode: 0 };
      }

      case 'curl': {
        const isHeaderOnly = rawArgs.includes('-I') || rawArgs.includes('--head');
        const url = rawArgs.find((a) => !a.startsWith('-')) || 'http://localhost:8080/health';

        if (url.includes(':8080') || url.includes('/health')) {
          if (isHeaderOnly) {
            return {
              stdout: 'HTTP/1.1 200 OK\nX-Powered-By: Express\nContent-Type: application/json; charset=utf-8\nContent-Length: 43\nDate: ' + new Date().toUTCString() + '\nConnection: keep-alive\n\n',
              stderr: '',
              exitCode: 0,
            };
          }
          return {
            stdout: '{"status":"healthy","uptime":1420.5,"environment":"production"}\n',
            stderr: '',
            exitCode: 0,
          };
        }

        return {
          stdout: `<!doctype html><html><head><title>CloudOps Gateway</title></head><body><h1>200 OK</h1><p>Welcome to Linux Practice Lab API Gateway.</p></body></html>\n`,
          stderr: '',
          exitCode: 0,
        };
      }

      case 'tar': {
        return { stdout: 'tar: archive operation completed successfully.\n', stderr: '', exitCode: 0 };
      }

      case 'gzip': {
        return { stdout: '', stderr: '', exitCode: 0 };
      }

      case 'echo': {
        const out = rawArgs.join(' ');
        return { stdout: out + '\n', stderr: '', exitCode: 0 };
      }

      case 'printf': {
        const format = rawArgs[0] || '';
        const args = rawArgs.slice(1);
        let out = format.replace(/\\n/g, '\n').replace(/\\t/g, '\t');
        args.forEach((a) => {
          out = out.replace(/%s|%d/, a);
        });
        return { stdout: out, stderr: '', exitCode: 0 };
      }

      case 'sort': {
        let numeric = rawArgs.includes('-n');
        let reverse = rawArgs.includes('-r');
        const files = rawArgs.filter((a) => !a.startsWith('-'));

        const source = files.length > 0 ? (this.vfs.resolvePathNode(files[0])?.content || '') : stdinText;
        const lines = source.split('\n').filter((l) => l.length > 0);

        lines.sort((a, b) => {
          if (numeric) {
            const numA = parseFloat(a) || 0;
            const numB = parseFloat(b) || 0;
            return numA - numB;
          }
          return a.localeCompare(b);
        });

        if (reverse) lines.reverse();
        return { stdout: lines.join('\n') + (lines.length ? '\n' : ''), stderr: '', exitCode: 0 };
      }

      case 'uniq': {
        let count = rawArgs.includes('-c');
        const files = rawArgs.filter((a) => !a.startsWith('-'));
        const source = files.length > 0 ? (this.vfs.resolvePathNode(files[0])?.content || '') : stdinText;
        const lines = source.split('\n').filter((l) => l.length > 0);

        const out: string[] = [];
        let prev = '';
        let c = 0;

        lines.forEach((l) => {
          if (l === prev) {
            c++;
          } else {
            if (prev) {
              out.push(count ? `${c.toString().padStart(4)} ${prev}` : prev);
            }
            prev = l;
            c = 1;
          }
        });
        if (prev) {
          out.push(count ? `${c.toString().padStart(4)} ${prev}` : prev);
        }

        return { stdout: out.join('\n') + (out.length ? '\n' : ''), stderr: '', exitCode: 0 };
      }

      case 'cut': {
        let delimiter = '\t';
        let fields: number[] = [1];
        const files: string[] = [];

        for (let i = 0; i < rawArgs.length; i++) {
          if (rawArgs[i] === '-d' && rawArgs[i + 1]) {
            delimiter = rawArgs[i + 1];
            i++;
          } else if (rawArgs[i].startsWith('-d')) {
            delimiter = rawArgs[i].slice(2);
          } else if (rawArgs[i] === '-f' && rawArgs[i + 1]) {
            fields = rawArgs[i + 1].split(',').map((n) => parseInt(n, 10));
            i++;
          } else if (rawArgs[i].startsWith('-f')) {
            fields = rawArgs[i].slice(2).split(',').map((n) => parseInt(n, 10));
          } else {
            files.push(rawArgs[i]);
          }
        }

        const source = files.length > 0 ? (this.vfs.resolvePathNode(files[0])?.content || '') : stdinText;
        const lines = source.split('\n');
        const out = lines
          .map((line) => {
            if (!line) return '';
            const parts = line.split(delimiter);
            return fields.map((f) => parts[f - 1] || '').join(delimiter);
          })
          .filter(Boolean);

        return { stdout: out.join('\n') + (out.length ? '\n' : ''), stderr: '', exitCode: 0 };
      }

      case 'wc': {
        const countLines = rawArgs.includes('-l');
        const countWords = rawArgs.includes('-w');
        const countChars = rawArgs.includes('-c');
        const files = rawArgs.filter((a) => !a.startsWith('-'));

        const source = files.length > 0 ? (this.vfs.resolvePathNode(files[0])?.content || '') : stdinText;
        const lineCount = source.split('\n').filter((_, i, arr) => !(i === arr.length - 1 && _ === '')).length;
        const wordCount = source.trim().split(/\s+/).filter(Boolean).length;
        const charCount = source.length;

        const fname = files[0] ? ` ${files[0]}` : '';
        if (countLines && !countWords && !countChars) {
          return { stdout: `${lineCount}${fname}\n`, stderr: '', exitCode: 0 };
        }
        if (countWords && !countLines && !countChars) {
          return { stdout: `${wordCount}${fname}\n`, stderr: '', exitCode: 0 };
        }
        if (countChars && !countLines && !countWords) {
          return { stdout: `${charCount}${fname}\n`, stderr: '', exitCode: 0 };
        }

        return { stdout: `${lineCount.toString().padStart(4)} ${wordCount.toString().padStart(4)} ${charCount.toString().padStart(5)}${fname}\n`, stderr: '', exitCode: 0 };
      }

      case 'sed': {
        // e.g. sed 's/foo/bar/g' file
        const expr = rawArgs[0] || '';
        const files = rawArgs.slice(1);
        const source = files.length > 0 ? (this.vfs.resolvePathNode(files[0])?.content || '') : stdinText;

        const match = expr.match(/^s\/([^/]+)\/([^/]*)\/([gimsuy]*)$/);
        if (match) {
          const [, search, replace, flags] = match;
          const reg = new RegExp(search, flags || 'g');
          const transformed = source.replace(reg, replace);
          return { stdout: transformed, stderr: '', exitCode: 0 };
        }
        return { stdout: source, stderr: '', exitCode: 0 };
      }

      case 'awk': {
        // Simple awk parser e.g. awk '{print $1}' or '{print $1, $9}'
        const script = rawArgs[0] || '';
        const files = rawArgs.slice(1);
        const source = files.length > 0 ? (this.vfs.resolvePathNode(files[0])?.content || '') : stdinText;

        const lines = source.split('\n').filter(Boolean);
        const fieldMatches = Array.from(script.matchAll(/\$(\d+)/g)).map((m) => parseInt(m[1], 10));

        if (fieldMatches.length > 0) {
          const out = lines.map((l) => {
            const parts = l.trim().split(/\s+/);
            return fieldMatches.map((f) => (f === 0 ? l : parts[f - 1] || '')).join(' ');
          });
          return { stdout: out.join('\n') + (out.length ? '\n' : ''), stderr: '', exitCode: 0 };
        }

        return { stdout: source, stderr: '', exitCode: 0 };
      }

      case 'top': {
        const topOutput = `top - 00:24:18 up 14 days,  3:22,  1 user,  load average: 0.12, 0.08, 0.05
Tasks:   8 total,   1 running,   7 sleeping,   0 stopped,   0 zombie
%Cpu(s):  1.2 us,  0.4 sy,  0.0 ni, 98.2 id,  0.1 wa,  0.0 hi,  0.1 si,  0.0 st
MiB Mem :   7948.2 total,   4210.4 free,   1820.6 used,   1917.2 buff/cache
MiB Swap:   2048.0 total,   2048.0 free,      0.0 used.   5860.1 avail Mem 

  PID USER      PR  NI    VIRT    RES    SHR S  %CPU  %MEM     TIME+ COMMAND
 1042 sai       20   0  342812  68420  14200 R  14.2   8.5   0:14.28 python3 worker.py
 1204 node      20   0  482104  34120  18400 S   1.5   4.2   0:08.12 node server.js
  341 www-data  20   0  124800  14500   8200 S   0.8   1.8   0:03.44 nginx: worker
  340 www-data  20   0  124200   9800   7400 S   0.2   1.2   0:01.02 nginx: master
  512 sai       20   0   24800   4100   3200 S   0.1   0.5   0:00.65 -bash
  114 root      20   0   18400   3200   2800 S   0.1   0.4   0:00.41 sshd
    1 root      20   0  168400  12200   8100 S   0.0   0.1   0:02.15 /sbin/init
`;
        return { stdout: topOutput, stderr: '', exitCode: 0 };
      }

      case 'uptime': {
        return {
          stdout: ' 00:24:18 up 14 days,  3:22,  1 user,  load average: 0.12, 0.08, 0.05\n',
          stderr: '',
          exitCode: 0,
        };
      }

      case 'tree': {
        const targetPath = rawArgs.find((a) => !a.startsWith('-')) || this.vfs.currentPath;
        const startNode = this.vfs.resolvePathNode(targetPath);
        if (!startNode) {
          return { stdout: '', stderr: `tree: '${targetPath}': No such file or directory\n`, exitCode: 1 };
        }

        let dirCount = 0;
        let fileCount = 0;
        const lines: string[] = [targetPath];

        const renderTree = (node: VFSNode, prefix: string) => {
          if (node.type !== 'directory' || !node.children) return;
          const entries = Array.from(node.children.entries()).filter(([name]) => !name.startsWith('.'));
          entries.sort(([a], [b]) => a.localeCompare(b));

          entries.forEach(([name, child], idx) => {
            const isLast = idx === entries.length - 1;
            const branch = isLast ? '└── ' : '├── ';
            const childPrefix = isLast ? '    ' : '│   ';
            const coloredName = child.type === 'directory' ? `\x1b[1;34m${name}\x1b[0m` : (child.permissions & 0o111 ? `\x1b[1;32m${name}\x1b[0m` : name);

            lines.push(`${prefix}${branch}${coloredName}`);
            if (child.type === 'directory') {
              dirCount++;
              renderTree(child, prefix + childPrefix);
            } else {
              fileCount++;
            }
          });
        };

        renderTree(startNode, '');
        lines.push(`\n${dirCount} directories, ${fileCount} files`);
        return { stdout: lines.join('\n') + '\n', stderr: '', exitCode: 0 };
      }

      case 'env': {
        const lines = Array.from(this.vfs.env.entries()).map(([k, v]) => `${k}=${v}`);
        return { stdout: lines.join('\n') + '\n', stderr: '', exitCode: 0 };
      }

      case 'which': {
        const bin = rawArgs[0];
        if (!bin) return { stdout: '', stderr: '', exitCode: 1 };
        const binaries: Record<string, string> = {
          bash: '/bin/bash',
          sh: '/bin/sh',
          ls: '/bin/ls',
          cat: '/bin/cat',
          grep: '/bin/grep',
          curl: '/usr/bin/curl',
          python3: '/usr/bin/python3',
          node: '/usr/bin/node',
          nginx: '/usr/sbin/nginx',
          ss: '/usr/bin/ss',
          tar: '/bin/tar',
          gzip: '/bin/gzip',
          find: '/usr/bin/find',
          ps: '/bin/ps',
          top: '/usr/bin/top',
          tree: '/usr/bin/tree',
        };
        if (binaries[bin]) {
          return { stdout: binaries[bin] + '\n', stderr: '', exitCode: 0 };
        }
        return { stdout: '', stderr: `/usr/bin/which: no ${bin} in (${this.vfs.env.get('PATH')})\n`, exitCode: 1 };
      }

      case 'stat': {
        const target = rawArgs[0];
        if (!target) return { stdout: '', stderr: 'stat: missing operand\n', exitCode: 1 };
        const node = this.vfs.resolvePathNode(target);
        if (!node) {
          return { stdout: '', stderr: `stat: cannot statx '${target}': No such file or directory\n`, exitCode: 1 };
        }
        const isDir = node.type === 'directory';
        const permOct = (node.permissions & 0o777).toString(8).padStart(4, '0');
        const permStr = VirtualFileSystem.formatPermissions(node.permissions, isDir);
        const statOut = `  File: ${target}
  Size: ${node.size.toString().padEnd(10)} Blocks: 8          IO Block: 4096   ${isDir ? 'directory' : 'regular file'}
Device: 259,2   Inode: 1048576     Links: 1
Access: (${permOct}/${permStr})  Uid: ( 1000/     ${node.owner})   Gid: ( 1000/     ${node.group})
Access: ${node.modified.toISOString()}
Modify: ${node.modified.toISOString()}
Change: ${node.modified.toISOString()}
`;
        return { stdout: statOut, stderr: '', exitCode: 0 };
      }

      case 'netstat': {
        const netstatOut = `Active Internet connections (only servers)
Proto Recv-Q Send-Q Local Address           Foreign Address         State      
tcp        0      0 0.0.0.0:80              0.0.0.0:*               LISTEN     
tcp        0      0 0.0.0.0:443             0.0.0.0:*               LISTEN     
tcp        0      0 0.0.0.0:22              0.0.0.0:*               LISTEN     
tcp        0      0 127.0.0.1:5432          0.0.0.0:*               LISTEN     
tcp        0      0 127.0.0.1:6379          0.0.0.0:*               LISTEN     
`;
        return { stdout: netstatOut, stderr: '', exitCode: 0 };
      }

      case 'systemctl': {
        const sub = rawArgs[0] || 'status';
        const srv = rawArgs[1] || 'nginx';
        if (sub === 'status') {
          return {
            stdout: `● ${srv}.service - The ${srv} HTTP and reverse proxy server
     Loaded: loaded (/lib/systemd/system/${srv}.service; enabled; vendor preset: enabled)
     Active: active (running) since Mon 2026-06-10 00:05:00 UTC; 14 days ago
       Docs: man:${srv}(8)
    Process: 340 ExecStart=/usr/sbin/${srv} -g daemon on; master_process on; (code=exited, status=0/SUCCESS)
   Main PID: 340 (${srv})
      Tasks: 2 (limit: 9482)
     Memory: 24.3M
        CPU: 1.020s
     CGroup: /system.slice/${srv}.service
             ├─340 "nginx: master process /usr/sbin/nginx"
             └─341 "nginx: worker process"
`,
            stderr: '',
            exitCode: 0,
          };
        }
        return { stdout: `Synchronizing state of ${srv}.service with SysV service script...\n`, stderr: '', exitCode: 0 };
      }

      case 'man': {
        const manTarget = rawArgs[0] || '';
        const manPages: Record<string, string> = {
          ls: `LS(1)                            User Commands                           LS(1)

NAME
       ls - list directory contents

SYNOPSIS
       ls [OPTION]... [FILE]...

DESCRIPTION
       List  information  about  the FILEs (the current directory by default).
       Sort entries alphabetically if none of -cftuvSUX nor --sort  is  speci‐
       fied.

       -a, --all
              do not ignore entries starting with .

       -l     use a long listing format

       -h, --human-readable
              with -l and -s, print sizes like 1K 234M 2G etc.
`,
          grep: `GREP(1)                          User Commands                          GREP(1)

NAME
       grep - print lines that match patterns

SYNOPSIS
       grep [OPTION...] PATTERNS [FILE...]

DESCRIPTION
       grep searches for PATTERNS in each FILE.

       -i, --ignore-case
              ignore case distinctions in patterns and input data.

       -v, --invert-match
              select non-matching lines.

       -c, --count
              suppress normal output; instead print a count of matching lines.

       -E, --extended-regexp
              interpret PATTERNS as extended regular expressions (EREs).
`,
          ss: `SS(8)                     System Manager's Manual                    SS(8)

NAME
       ss - another utility to investigate sockets

SYNOPSIS
       ss [options] [ FILTER ]

DESCRIPTION
       ss is used to dump socket statistics. It allows showing information sim‐
       ilar to netstat. It can display more TCP and state information than other
       tools.

       -t, --tcp
              Display TCP sockets.

       -u, --udp
              Display UDP sockets.

       -l, --listening
              Display only listening sockets.

       -p, --processes
              Show process using socket.

       -n, --numeric
              Do not try to resolve service names.
`,
        };

        if (manPages[manTarget]) {
          return { stdout: manPages[manTarget], stderr: '', exitCode: 0 };
        }
        return {
          stdout: `${manTarget.toUpperCase()}(1) - Linux General Commands Manual\n\nNAME\n       ${manTarget} - Unix command execution utility\n\nDESCRIPTION\n       Refer to online manual pages or use '--help' for synopsis.\n`,
          stderr: '',
          exitCode: 0,
        };
      }

      case 'help': {
        const helpText = `Linux Practice Lab - Supported Built-in & Unix Commands:
  Filesystem:     pwd, ls, cd, mkdir, touch, cp, mv, rm, cat, head, tail, find, tree, chmod, chown, stat
  Processes:      ps, kill, top, uptime
  Diagnostics:    df, du, free, ip, ping, curl, ss, netstat, systemctl, tar, gzip, uname, date, whoami, which, man
  Text Streams:   echo, printf, sort, uniq, cut, wc, sed, awk, grep
  Shell Features: pipes (|), output redirects (>, >>), environment variables, history, clear
`;
        return { stdout: helpText, stderr: '', exitCode: 0 };
      }

      default:
        // Check if executable file in PATH or current dir e.g. ./deploy.sh
        if (cmd.startsWith('./') || cmd.startsWith('/')) {
          const node = this.vfs.resolvePathNode(cmd);
          if (!node) {
            return { stdout: '', stderr: `bash: ${cmd}: No such file or directory\n`, exitCode: 127 };
          }
          if (!(node.permissions & 0o111)) {
            return { stdout: '', stderr: `bash: ${cmd}: Permission denied\n`, exitCode: 126 };
          }
          // Simulate executing bash script
          const out = `==> Executing ${node.name}...\nScript output: Success [Exit 0]\n`;
          return { stdout: out, stderr: '', exitCode: 0 };
        }

        return { stdout: '', stderr: `bash: ${cmd}: command not found\n`, exitCode: 127 };
    }
  }
}
