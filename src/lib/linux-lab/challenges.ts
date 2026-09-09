import { VirtualFileSystem } from './vfs';
import { CommandOutput } from './commandEngine';

export type ChallengeCategory =
  | 'fundamentals'
  | 'files'
  | 'permissions'
  | 'processes'
  | 'networking'
  | 'text'
  | 'bash';

export interface Challenge {
  id: number;
  slug: string;
  category: ChallengeCategory;
  categoryTitle: string;
  title: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  xp: number;
  scenario: string;
  objective: string;
  hints: string[]; // [Level 1: Conceptual, Level 2: Syntax, Level 3: Direct guidance]
  solution: string;
  explanation: string;
  validate: (vfs: VirtualFileSystem, lastOutput: CommandOutput, lastCommand: string) => { passed: boolean; message: string };
}

export const CATEGORIES: { id: ChallengeCategory; title: string; count: number; description: string }[] = [
  { id: 'fundamentals', title: '1. Linux Fundamentals', count: 10, description: 'Core navigation, inspection, and fundamental Unix filesystem concepts.' },
  { id: 'files', title: '2. Files and Directories', count: 8, description: 'Advanced file queries, directory hierarchies, and size/type matching.' },
  { id: 'permissions', title: '3. Permissions & Security', count: 6, description: 'rwx bits, numeric octal chmod, ownership, and least-privilege security.' },
  { id: 'processes', title: '4. Processes & Lifecycle', count: 5, description: 'Process trees, PIDs, signals, resource monitoring, and background jobs.' },
  { id: 'networking', title: '5. Cloud Networking', count: 6, description: 'IP addressing, interface routing, listening sockets, curl, and DNS.' },
  { id: 'text', title: '6. Stream & Text Processing', count: 9, description: 'grep, awk, sed, cut, sort, uniq, wc, pipes, and output redirection.' },
  { id: 'bash', title: '7. Bash Shell & Scripting', count: 9, description: 'Shell parameters, environment variables, conditionals, loops, and automation.' },
];

export const CHALLENGES: Challenge[] = [
  // ----------------------------------------------------
  // 1. Linux Fundamentals (1 - 10)
  // ----------------------------------------------------
  {
    id: 1,
    slug: 'pwd-current-directory',
    category: 'fundamentals',
    categoryTitle: 'Linux Fundamentals',
    title: 'Display the Current Directory',
    difficulty: 'Beginner',
    xp: 50,
    scenario: 'You have just logged into a remote Linux server via SSH to inspect an incident. First, determine which directory your shell session currently resides in.',
    objective: 'Run the command that prints the absolute working directory path to stdout.',
    hints: [
      'Think of the acronym for "Print Working Directory".',
      'The command is 3 letters long starting with "p".',
      'Type `pwd` and press Enter.'
    ],
    solution: 'pwd',
    explanation: 'The `pwd` (print working directory) command writes the full absolute pathname of the current working directory to standard output. It is essential when orienting yourself inside complex directory trees.',
    validate: (_vfs, lastOutput, lastCommand) => {
      const cmd = lastCommand.trim().toLowerCase();
      if (cmd === 'pwd' && lastOutput.stdout.includes('/home/sai')) {
        return { passed: true, message: 'Verified: Absolute path /home/sai displayed.' };
      }
      return { passed: false, message: 'Make sure to run `pwd`.' };
    }
  },
  {
    id: 2,
    slug: 'ls-list-files',
    category: 'fundamentals',
    categoryTitle: 'Linux Fundamentals',
    title: 'List Files with Detailed Metadata',
    difficulty: 'Beginner',
    xp: 60,
    scenario: 'You need to audit the contents of the home directory, including hidden dotfiles and detailed permission strings.',
    objective: 'List all files in the current directory including hidden files with detailed metadata (permissions, owner, size).',
    hints: [
      'Use the `ls` command with flags.',
      'The `-l` flag gives a long listing format, and `-a` includes all hidden files.',
      'Combine them: `ls -la` or `ls -al`.'
    ],
    solution: 'ls -la',
    explanation: '`ls -la` combines `-l` (long format showing permissions, hard links, owner, group, size, and timestamp) with `-a` (all, showing entries starting with `.`, such as `.bashrc` or `.` and `..`).',
    validate: (_vfs, lastOutput, lastCommand) => {
      const cmd = lastCommand.trim().toLowerCase();
      if (cmd.startsWith('ls') && (cmd.includes('-la') || cmd.includes('-al') || (cmd.includes('-l') && cmd.includes('-a')))) {
        return { passed: true, message: 'Verified: Detailed file listing with hidden entries generated.' };
      }
      return { passed: false, message: 'Run `ls -la` or `ls -al` to see detailed metadata and hidden files.' };
    }
  },
  {
    id: 3,
    slug: 'mkdir-create-directory',
    category: 'fundamentals',
    categoryTitle: 'Linux Fundamentals',
    title: 'Create a New Directory',
    difficulty: 'Beginner',
    xp: 60,
    scenario: 'You need to set up a new folder called "backups" inside your current home directory to stage database snapshots.',
    objective: 'Create a directory named `backups` in the current working directory.',
    hints: [
      'Use the command for "make directory".',
      'The command begins with `mk...` followed by the directory name.',
      'Type `mkdir backups` and press Enter.'
    ],
    solution: 'mkdir backups',
    explanation: 'The `mkdir` (make directory) utility creates new directories in the filesystem provided the user has write permissions in the parent directory.',
    validate: (vfs) => {
      const node = vfs.resolvePathNode('/home/sai/backups');
      if (node && node.type === 'directory') {
        return { passed: true, message: 'Verified: /home/sai/backups exists as a directory.' };
      }
      return { passed: false, message: 'Directory "backups" not found in current directory.' };
    }
  },
  {
    id: 4,
    slug: 'touch-create-file',
    category: 'fundamentals',
    categoryTitle: 'Linux Fundamentals',
    title: 'Create an Empty File',
    difficulty: 'Beginner',
    xp: 60,
    scenario: 'You need to create a flag file named `maintenance.flag` in the current directory to signal an upcoming maintenance window.',
    objective: 'Create an empty file called `maintenance.flag` using the standard Linux utility.',
    hints: [
      'What command creates an empty file or touches its modification time?',
      'The command is `touch` followed by the file name.',
      'Type `touch maintenance.flag` and hit Enter.'
    ],
    solution: 'touch maintenance.flag',
    explanation: '`touch` is primarily designed to update file timestamps. However, if the target file does not exist, `touch` creates an empty file with default permissions according to the umask.',
    validate: (vfs) => {
      const node = vfs.resolvePathNode('/home/sai/maintenance.flag');
      if (node && node.type === 'file') {
        return { passed: true, message: 'Verified: maintenance.flag file created successfully.' };
      }
      return { passed: false, message: 'File "maintenance.flag" was not found in /home/sai.' };
    }
  },
  {
    id: 5,
    slug: 'mv-move-file',
    category: 'fundamentals',
    categoryTitle: 'Linux Fundamentals',
    title: 'Move a File to a Directory',
    difficulty: 'Beginner',
    xp: 70,
    scenario: 'You want to organize your files by moving `config.txt` into the `scripts/` directory.',
    objective: 'Move `config.txt` into the `scripts` directory.',
    hints: [
      'Use the move command `mv`.',
      'The syntax is `mv <source> <destination>`.',
      'Type `mv config.txt scripts/`.'
    ],
    solution: 'mv config.txt scripts/',
    explanation: 'The `mv` command moves files or directories from one location to another. If the destination is an existing directory, the file retains its name within that directory.',
    validate: (vfs) => {
      const target = vfs.resolvePathNode('/home/sai/scripts/config.txt');
      const old = vfs.resolvePathNode('/home/sai/config.txt');
      if (target && !old) {
        return { passed: true, message: 'Verified: config.txt successfully relocated to scripts/.' };
      }
      return { passed: false, message: 'config.txt is still in the old location or missing in scripts/.' };
    }
  },
  {
    id: 6,
    slug: 'cp-copy-file',
    category: 'fundamentals',
    categoryTitle: 'Linux Fundamentals',
    title: 'Copy a File',
    difficulty: 'Beginner',
    xp: 70,
    scenario: 'Before editing the production user records, create a backup copy of `users.txt` named `users.bak`.',
    objective: 'Copy `users.txt` to a new file named `users.bak`.',
    hints: [
      'Use the copy command `cp`.',
      'The format is `cp <source_file> <dest_file>`.',
      'Type `cp users.txt users.bak`.'
    ],
    solution: 'cp users.txt users.bak',
    explanation: '`cp` copies files and directories. Copying critical configuration or data files prior to making changes is a core DevOps best practice for disaster recovery.',
    validate: (vfs) => {
      const bak = vfs.resolvePathNode('/home/sai/users.bak');
      const orig = vfs.resolvePathNode('/home/sai/users.txt');
      if (bak && orig) {
        return { passed: true, message: 'Verified: users.bak copy created with original preserved.' };
      }
      return { passed: false, message: 'users.bak was not found in the current directory.' };
    }
  },
  {
    id: 7,
    slug: 'mv-rename-file',
    category: 'fundamentals',
    categoryTitle: 'Linux Fundamentals',
    title: 'Rename a File',
    difficulty: 'Beginner',
    xp: 70,
    scenario: 'You have `README.md` and want to rename it to `INSTRUCTIONS.md` to clarify its purpose.',
    objective: 'Rename `README.md` to `INSTRUCTIONS.md` using the `mv` command.',
    hints: [
      'In Linux, moving a file to a new name in the same directory renames it.',
      'Use `mv old_name new_name`.',
      'Type `mv README.md INSTRUCTIONS.md`.'
    ],
    solution: 'mv README.md INSTRUCTIONS.md',
    explanation: 'In Unix-like systems, renaming is conceptually identical to moving an inode entry within the directory table. `mv` achieves both.',
    validate: (vfs) => {
      const newFile = vfs.resolvePathNode('/home/sai/INSTRUCTIONS.md');
      const oldFile = vfs.resolvePathNode('/home/sai/README.md');
      if (newFile && !oldFile) {
        return { passed: true, message: 'Verified: README.md successfully renamed to INSTRUCTIONS.md.' };
      }
      return { passed: false, message: 'INSTRUCTIONS.md not found or README.md still exists.' };
    }
  },
  {
    id: 8,
    slug: 'rm-delete-file',
    category: 'fundamentals',
    categoryTitle: 'Linux Fundamentals',
    title: 'Delete a File',
    difficulty: 'Beginner',
    xp: 60,
    scenario: 'A temporary file named `temp.log` was created. Safely remove it from the system.',
    objective: 'Create a file `temp.log` (if not present) and then delete it using the `rm` command.',
    hints: [
      'First run `touch temp.log` if it does not exist.',
      'Use the `rm` command to remove the file.',
      'Type `rm temp.log`.'
    ],
    solution: 'touch temp.log && rm temp.log',
    explanation: 'The `rm` command unlinks files from the filesystem index. Unlike GUI trash cans, `rm` deletes files immediately without a recycle bin recovery step.',
    validate: (_vfs, _lastOutput, lastCommand) => {
      if (lastCommand.includes('rm') && lastCommand.includes('temp.log')) {
        return { passed: true, message: 'Verified: temp.log unlinked and deleted.' };
      }
      return { passed: false, message: 'Execute `rm temp.log` to complete this challenge.' };
    }
  },
  {
    id: 9,
    slug: 'cat-read-file',
    category: 'fundamentals',
    categoryTitle: 'Linux Fundamentals',
    title: 'Concatenate and Read File Contents',
    difficulty: 'Beginner',
    xp: 60,
    scenario: 'You need to quickly inspect the system operating system release details located at `/etc/os-release`.',
    objective: 'Print the contents of `/etc/os-release` to standard output.',
    hints: [
      'Use the concatenate command `cat`.',
      'Provide the absolute path `/etc/os-release`.',
      'Type `cat /etc/os-release`.'
    ],
    solution: 'cat /etc/os-release',
    explanation: '`cat` (concatenate) sequentially reads files and writes them to standard output. It is standard for displaying configuration files and small text documents.',
    validate: (_vfs, lastOutput, lastCommand) => {
      if (lastCommand.includes('cat') && lastCommand.includes('/etc/os-release') && lastOutput.stdout.includes('Ubuntu')) {
        return { passed: true, message: 'Verified: /etc/os-release contents displayed.' };
      }
      return { passed: false, message: 'Run `cat /etc/os-release`.' };
    }
  },
  {
    id: 10,
    slug: 'find-search-file',
    category: 'fundamentals',
    categoryTitle: 'Linux Fundamentals',
    title: 'Locate a File in the Hierarchy',
    difficulty: 'Intermediate',
    xp: 80,
    scenario: 'You need to locate the Node.js `server.js` file across the `/home/sai` tree.',
    objective: 'Use the `find` utility to locate `server.js` starting from the current directory.',
    hints: [
      'Use `find` with the `-name` option.',
      'Specify the search path `.` or `/home/sai`.',
      'Type `find . -name "server.js"`.'
    ],
    solution: 'find . -name "server.js"',
    explanation: '`find` traverses filesystem trees to find files matching user-defined criteria such as names, wildcards, types, and modification times.',
    validate: (_vfs, lastOutput, lastCommand) => {
      if (lastCommand.includes('find') && lastCommand.includes('server.js') && lastOutput.stdout.includes('server.js')) {
        return { passed: true, message: 'Verified: File server.js located in the hierarchy.' };
      }
      return { passed: false, message: 'Run `find . -name "server.js"`.' };
    }
  },

  // ----------------------------------------------------
  // 2. Files and Directories (11 - 18)
  // ----------------------------------------------------
  {
    id: 11,
    slug: 'mkdir-nested-directories',
    category: 'files',
    categoryTitle: 'Files and Directories',
    title: 'Create Nested Parent Directories in One Step',
    difficulty: 'Intermediate',
    xp: 80,
    scenario: 'You are setting up an Ansible role directory structure: `deployments/roles/webserver/tasks`. You want to create all intermediate directories with a single command.',
    objective: 'Create the nested path `deployments/roles/webserver/tasks` using `mkdir -p`.',
    hints: [
      'Look at the `-p` (parents) option in `mkdir`.',
      'Syntax: `mkdir -p <nested/path>`.',
      'Type `mkdir -p deployments/roles/webserver/tasks`.'
    ],
    solution: 'mkdir -p deployments/roles/webserver/tasks',
    explanation: 'The `-p` (or `--parents`) flag instructs `mkdir` to create any missing intermediate parent directories automatically without erroring if they already exist.',
    validate: (vfs) => {
      const node = vfs.resolvePathNode('/home/sai/deployments/roles/webserver/tasks');
      if (node && node.type === 'directory') {
        return { passed: true, message: 'Verified: Full nested path created cleanly.' };
      }
      return { passed: false, message: 'Path deployments/roles/webserver/tasks not found.' };
    }
  },
  {
    id: 12,
    slug: 'find-by-name-wildcard',
    category: 'files',
    categoryTitle: 'Files and Directories',
    title: 'Find All Log Files Recursively',
    difficulty: 'Intermediate',
    xp: 80,
    scenario: 'During an audit, you need to find all `.log` files in the current user directory.',
    objective: 'Search the current directory recursively for all files ending with the `.log` extension.',
    hints: [
      'Use `find .` with the `-name` parameter and a wildcard.',
      'Enclose `"*.log"` in quotes to prevent premature shell glob expansion.',
      'Type `find . -name "*.log"`.'
    ],
    solution: 'find . -name "*.log"',
    explanation: 'Quoting the wildcard `*.log` prevents the shell from expanding the wildcard before `find` receives it, ensuring `find` evaluates the pattern against every traversed file.',
    validate: (_vfs, lastOutput, lastCommand) => {
      if (lastCommand.includes('find') && lastCommand.includes('*.log') && lastOutput.stdout.includes('.log')) {
        return { passed: true, message: 'Verified: All .log files listed across directories.' };
      }
      return { passed: false, message: 'Run `find . -name "*.log"`.' };
    }
  },
  {
    id: 13,
    slug: 'find-by-type',
    category: 'files',
    categoryTitle: 'Files and Directories',
    title: 'Find Only Directories',
    difficulty: 'Intermediate',
    xp: 80,
    scenario: 'You want an inventory of every directory under `/home/sai` without seeing regular files.',
    objective: 'Run a `find` command that returns only directories (`type d`).',
    hints: [
      'Use the `-type` test parameter in `find`.',
      'The symbol for directory type is `d`.',
      'Type `find . -type d`.'
    ],
    solution: 'find . -type d',
    explanation: 'The `-type d` flag restricts `find` to directories, ignoring regular files (`-type f`), symlinks (`-type l`), and sockets.',
    validate: (_vfs, lastOutput, lastCommand) => {
      if (lastCommand.includes('find') && lastCommand.includes('-type d') && lastOutput.stdout.includes('projects')) {
        return { passed: true, message: 'Verified: Directory entries isolated.' };
      }
      return { passed: false, message: 'Run `find . -type d`.' };
    }
  },
  {
    id: 14,
    slug: 'find-by-type-files',
    category: 'files',
    categoryTitle: 'Files and Directories',
    title: 'Find Regular Files Only',
    difficulty: 'Intermediate',
    xp: 80,
    scenario: 'Now find only regular files (`type f`) inside the `scripts` directory.',
    objective: 'List all regular files inside `scripts/` using `find`.',
    hints: [
      'Specify `scripts` as the starting search directory.',
      'Use `-type f`.',
      'Type `find scripts -type f`.'
    ],
    solution: 'find scripts -type f',
    explanation: '`-type f` matches only regular files, filtering out subdirectories and special device files.',
    validate: (_vfs, lastOutput, lastCommand) => {
      if (lastCommand.includes('find') && lastCommand.includes('-type f') && (lastOutput.stdout.includes('deploy.sh') || lastOutput.stdout.includes('backup.sh'))) {
        return { passed: true, message: 'Verified: Regular files in scripts/ identified.' };
      }
      return { passed: false, message: 'Run `find scripts -type f`.' };
    }
  },
  {
    id: 15,
    slug: 'count-files-pipeline',
    category: 'files',
    categoryTitle: 'Files and Directories',
    title: 'Count Files in Current Directory',
    difficulty: 'Intermediate',
    xp: 90,
    scenario: 'You need to quickly count how many non-hidden entries exist in the current working directory.',
    objective: 'Use a pipeline connecting `ls` to `wc -l` to count the entries.',
    hints: [
      'Use the Unix pipe operator `|`.',
      '`ls` lists one item per line when piped, and `wc -l` counts lines.',
      'Type `ls | wc -l`.'
    ],
    solution: 'ls | wc -l',
    explanation: 'Piping the output of `ls` to `wc -l` is the classic Unix idiom for counting directory entries. `wc` counts newline delimiters.',
    validate: (_vfs, lastOutput, lastCommand) => {
      if (lastCommand.includes('ls') && lastCommand.includes('|') && lastCommand.includes('wc -l') && /\d+/.test(lastOutput.stdout)) {
        return { passed: true, message: `Verified: Output ${lastOutput.stdout.trim()} items counted.` };
      }
      return { passed: false, message: 'Run `ls | wc -l`.' };
    }
  },
  {
    id: 16,
    slug: 'head-first-lines',
    category: 'files',
    categoryTitle: 'Files and Directories',
    title: 'Display the First Lines of a Log',
    difficulty: 'Beginner',
    xp: 70,
    scenario: 'A service crashed immediately upon startup. Inspect the first 5 lines of `logs/application.log`.',
    objective: 'Display the first 5 lines of `logs/application.log` using the `head` command.',
    hints: [
      'Use `head` with the line count flag.',
      'The `-n` flag specifies the number of lines.',
      'Type `head -n 5 logs/application.log`.'
    ],
    solution: 'head -n 5 logs/application.log',
    explanation: '`head` outputs the first part of files (defaulting to 10 lines). Specifying `-n 5` restricts the output to the initial 5 records.',
    validate: (_vfs, lastOutput, lastCommand) => {
      if (lastCommand.includes('head') && (lastCommand.includes('-n 5') || lastCommand.includes('-5')) && lastOutput.stdout.includes('Application initialized')) {
        return { passed: true, message: 'Verified: First 5 log lines retrieved.' };
      }
      return { passed: false, message: 'Run `head -n 5 logs/application.log`.' };
    }
  },
  {
    id: 17,
    slug: 'tail-last-lines',
    category: 'files',
    categoryTitle: 'Files and Directories',
    title: 'Display the Last Lines of a Log',
    difficulty: 'Beginner',
    xp: 70,
    scenario: 'An alert just fired. Inspect the last 3 lines of `logs/application.log` to observe recent events.',
    objective: 'Display the last 3 lines of `logs/application.log` using `tail`.',
    hints: [
      'Use `tail` with the `-n` parameter.',
      'Pass 3 as the line argument.',
      'Type `tail -n 3 logs/application.log`.'
    ],
    solution: 'tail -n 3 logs/application.log',
    explanation: '`tail` displays the final lines of a file, making it the premier tool for incident diagnostics and log streaming (`tail -f`).',
    validate: (_vfs, lastOutput, lastCommand) => {
      if (lastCommand.includes('tail') && (lastCommand.includes('-n 3') || lastCommand.includes('-3')) && lastOutput.stdout.includes('Graceful restart')) {
        return { passed: true, message: 'Verified: Recent log entries retrieved.' };
      }
      return { passed: false, message: 'Run `tail -n 3 logs/application.log`.' };
    }
  },
  {
    id: 18,
    slug: 'grep-search-text',
    category: 'files',
    categoryTitle: 'Files and Directories',
    title: 'Filter Errors with grep',
    difficulty: 'Intermediate',
    xp: 80,
    scenario: 'Filter out all fatal error events in `logs/application.log` containing the substring "ERROR".',
    objective: 'Search for all occurrences of "ERROR" in `logs/application.log`.',
    hints: [
      'Use the `grep` utility.',
      'Syntax: `grep "PATTERN" file`.',
      'Type `grep "ERROR" logs/application.log`.'
    ],
    solution: 'grep "ERROR" logs/application.log',
    explanation: '`grep` processes text line-by-line using regular expressions, printing every line that contains a match.',
    validate: (_vfs, lastOutput, lastCommand) => {
      if (lastCommand.includes('grep') && lastCommand.includes('ERROR') && lastOutput.stdout.includes('ERROR')) {
        return { passed: true, message: 'Verified: ERROR log events filtered.' };
      }
      return { passed: false, message: 'Run `grep "ERROR" logs/application.log`.' };
    }
  },

  // ----------------------------------------------------
  // 3. Permissions (19 - 24)
  // ----------------------------------------------------
  {
    id: 19,
    slug: 'permissions-inspect',
    category: 'permissions',
    categoryTitle: 'Permissions & Security',
    title: 'Understand and Inspect rwx Permissions',
    difficulty: 'Beginner',
    xp: 70,
    scenario: 'Before adjusting permissions, inspect the exact mode flags on `scripts/deploy.sh`.',
    objective: 'Run `ls -l scripts/deploy.sh` to check its permission bits.',
    hints: [
      'Use `ls -l` targeting the specific script.',
      'Target path: `scripts/deploy.sh`.',
      'Type `ls -l scripts/deploy.sh`.'
    ],
    solution: 'ls -l scripts/deploy.sh',
    explanation: 'The 10-character string indicates file type (`-` or `d`) followed by owner (rwx), group (rwx), and others (rwx).',
    validate: (_vfs, lastOutput, lastCommand) => {
      if (lastCommand.includes('ls') && lastCommand.includes('-l') && lastCommand.includes('deploy.sh')) {
        return { passed: true, message: 'Verified: Permission string displayed.' };
      }
      return { passed: false, message: 'Run `ls -l scripts/deploy.sh`.' };
    }
  },
  {
    id: 20,
    slug: 'chmod-make-executable',
    category: 'permissions',
    categoryTitle: 'Permissions & Security',
    title: 'Make a Script Executable',
    difficulty: 'Intermediate',
    xp: 80,
    scenario: 'The deployment automation script `scripts/deploy.sh` cannot be run directly because it lacks the execute (`x`) permission.',
    objective: 'Add execute permission to `scripts/deploy.sh` using `chmod +x`.',
    hints: [
      'Use `chmod` with symbolic mode `+x`.',
      'Target `scripts/deploy.sh`.',
      'Type `chmod +x scripts/deploy.sh`.'
    ],
    solution: 'chmod +x scripts/deploy.sh',
    explanation: '`chmod +x` activates the executable bit across user, group, and other classes, allowing the kernel to load and execute the file binary or script interpreter.',
    validate: (vfs) => {
      const node = vfs.resolvePathNode('/home/sai/scripts/deploy.sh');
      if (node && (node.permissions & 0o111)) {
        return { passed: true, message: 'Verified: Execute bit is now active on deploy.sh.' };
      }
      return { passed: false, message: 'deploy.sh still lacks executable permissions.' };
    }
  },
  {
    id: 21,
    slug: 'chmod-numeric-octal',
    category: 'permissions',
    categoryTitle: 'Permissions & Security',
    title: 'Apply Octal Permissions (755)',
    difficulty: 'Intermediate',
    xp: 90,
    scenario: 'Enforce standard web/script permissions on `scripts/backup.sh`: read/write/execute for owner (7), read/execute for group (5), and read/execute for others (5).',
    objective: 'Change the permissions of `scripts/backup.sh` to numeric mode `755`.',
    hints: [
      'Use `chmod` with numeric mode `755`.',
      '7 = rwx (4+2+1), 5 = r-x (4+1).',
      'Type `chmod 755 scripts/backup.sh`.'
    ],
    solution: 'chmod 755 scripts/backup.sh',
    explanation: 'Octal modes represent permissions in 3-bit binary numbers: read = 4, write = 2, execute = 1. 755 represents rwxr-xr-x.',
    validate: (vfs) => {
      const node = vfs.resolvePathNode('/home/sai/scripts/backup.sh');
      if (node && (node.permissions & 0o777) === 0o755) {
        return { passed: true, message: 'Verified: backup.sh permission set to 0755.' };
      }
      return { passed: false, message: 'backup.sh permissions are not 755.' };
    }
  },
  {
    id: 22,
    slug: 'chmod-restrictive-config',
    category: 'permissions',
    categoryTitle: 'Permissions & Security',
    title: 'Enforce Least Privilege on Config (600)',
    difficulty: 'Intermediate',
    xp: 90,
    scenario: '`config.txt` contains sensitive database credentials. Security policy dictates that ONLY the owner may read and write to this file (mode 600).',
    objective: 'Set permissions on `config.txt` to `600` so other users have zero access.',
    hints: [
      '6 = rw- (4+2), 0 = no permissions.',
      'Use `chmod 600`.',
      'Type `chmod 600 config.txt`.'
    ],
    solution: 'chmod 600 config.txt',
    explanation: 'Mode 600 (`-rw-------`) ensures confidential files like private keys and configuration tokens are strictly accessible only by the owning UID.',
    validate: (vfs) => {
      const node = vfs.resolvePathNode('/home/sai/config.txt');
      if (node && (node.permissions & 0o777) === 0o600) {
        return { passed: true, message: 'Verified: config.txt locked down to rw------- (600).' };
      }
      return { passed: false, message: 'config.txt is not set to 600.' };
    }
  },
  {
    id: 23,
    slug: 'chown-change-owner',
    category: 'permissions',
    categoryTitle: 'Permissions & Security',
    title: 'Change File Owner and Group',
    difficulty: 'Intermediate',
    xp: 90,
    scenario: 'Reassign ownership of `users.txt` to user `devops` and group `devops`.',
    objective: 'Change the owner and group of `users.txt` to `devops:devops`.',
    hints: [
      'Use the `chown` (change owner) command.',
      'Syntax: `chown user:group file`.',
      'Type `chown devops:devops users.txt`.'
    ],
    solution: 'chown devops:devops users.txt',
    explanation: '`chown` alters user and group ownership on target filesystem nodes.',
    validate: (vfs) => {
      const node = vfs.resolvePathNode('/home/sai/users.txt');
      if (node && node.owner === 'devops' && node.group === 'devops') {
        return { passed: true, message: 'Verified: Ownership changed to devops:devops.' };
      }
      return { passed: false, message: 'users.txt owner/group is not devops:devops.' };
    }
  },
  {
    id: 24,
    slug: 'troubleshoot-permissions',
    category: 'permissions',
    categoryTitle: 'Permissions & Security',
    title: 'Troubleshoot Execution Permission Failure',
    difficulty: 'Intermediate',
    xp: 100,
    scenario: 'You tried running `./scripts/healthcheck.sh` and got "Permission denied". Fix the script so it can be executed directly.',
    objective: 'Add execute permissions to `scripts/healthcheck.sh` and verify by running `./scripts/healthcheck.sh`.',
    hints: [
      'First run `chmod +x scripts/healthcheck.sh`.',
      'Then execute `./scripts/healthcheck.sh`.',
      'Commands: `chmod +x scripts/healthcheck.sh` followed by `./scripts/healthcheck.sh`.'
    ],
    solution: 'chmod +x scripts/healthcheck.sh && ./scripts/healthcheck.sh',
    explanation: 'Permission denied errors when executing shell scripts usually stem from missing execute (`x`) permission or filesystem mounts with `noexec`.',
    validate: (vfs) => {
      const node = vfs.resolvePathNode('/home/sai/scripts/healthcheck.sh');
      if (node && (node.permissions & 0o111)) {
        return { passed: true, message: 'Verified: healthcheck.sh is now executable!' };
      }
      return { passed: false, message: 'scripts/healthcheck.sh still lacks execute permission.' };
    }
  },

  // ----------------------------------------------------
  // 4. Processes (25 - 29)
  // ----------------------------------------------------
  {
    id: 25,
    slug: 'ps-list-processes',
    category: 'processes',
    categoryTitle: 'Processes & Lifecycle',
    title: 'List All Running Processes',
    difficulty: 'Beginner',
    xp: 70,
    scenario: 'A server reports high CPU utilization. Inspect all currently running processes across all users.',
    objective: 'Run `ps aux` to display a complete list of running processes with CPU and memory usage.',
    hints: [
      'Use `ps` with `aux` BSD flags.',
      'a = all users, u = display user/owner, x = include processes not attached to terminal.',
      'Type `ps aux`.'
    ],
    solution: 'ps aux',
    explanation: '`ps aux` produces a comprehensive snapshot of active processes, reporting user, PID, %CPU, %MEM, virtual/resident memory, state, start time, and command line arguments.',
    validate: (_vfs, lastOutput, lastCommand) => {
      if (lastCommand.trim().startsWith('ps') && (lastCommand.includes('aux') || lastCommand.includes('-ef')) && lastOutput.stdout.includes('PID')) {
        return { passed: true, message: 'Verified: Process table displayed.' };
      }
      return { passed: false, message: 'Run `ps aux` or `ps -ef`.' };
    }
  },
  {
    id: 26,
    slug: 'ps-grep-process',
    category: 'processes',
    categoryTitle: 'Processes & Lifecycle',
    title: 'Filter a Specific Process with grep',
    difficulty: 'Intermediate',
    xp: 80,
    scenario: 'You need to verify if the `nginx` web server is currently running.',
    objective: 'Pipe `ps aux` to `grep nginx` to isolate nginx process entries.',
    hints: [
      'Combine `ps aux` with a pipe `|`.',
      'Pipe into `grep nginx`.',
      'Type `ps aux | grep nginx`.'
    ],
    solution: 'ps aux | grep nginx',
    explanation: 'Combining `ps aux | grep <pattern>` is the universal diagnostic method for locating a process by name or arguments.',
    validate: (_vfs, lastOutput, lastCommand) => {
      if (lastCommand.includes('ps') && lastCommand.includes('|') && lastCommand.includes('grep') && lastCommand.includes('nginx') && lastOutput.stdout.includes('nginx')) {
        return { passed: true, message: 'Verified: Nginx master and worker processes located.' };
      }
      return { passed: false, message: 'Run `ps aux | grep nginx`.' };
    }
  },
  {
    id: 27,
    slug: 'understand-pid',
    category: 'processes',
    categoryTitle: 'Processes & Lifecycle',
    title: 'Inspect Process ID and High CPU Consumption',
    difficulty: 'Intermediate',
    xp: 80,
    scenario: 'Find the PID of the misbehaving python worker script that is consuming high CPU.',
    objective: 'Inspect `ps aux` and notice the PID for `worker.py` (PID 1042).',
    hints: [
      'Run `ps aux | grep python` or `ps aux`.',
      'Look at the PID column for python3 /home/sai/scripts/worker.py.',
      'Type `ps aux | grep worker`.'
    ],
    solution: 'ps aux | grep worker',
    explanation: 'Process IDs (PIDs) are unique integers assigned by the Linux kernel upon process creation (via `fork()`), essential for signaling.',
    validate: (_vfs, lastOutput, lastCommand) => {
      if (lastCommand.includes('ps') && (lastCommand.includes('worker') || lastCommand.includes('python')) && lastOutput.stdout.includes('1042')) {
        return { passed: true, message: 'Verified: Process 1042 identified.' };
      }
      return { passed: false, message: 'Run `ps aux | grep worker`.' };
    }
  },
  {
    id: 28,
    slug: 'kill-process',
    category: 'processes',
    categoryTitle: 'Processes & Lifecycle',
    title: 'Terminate a Process by PID',
    difficulty: 'Intermediate',
    xp: 90,
    scenario: 'The rogue worker process with PID `1042` is leaking memory. Terminate it immediately.',
    objective: 'Send a termination signal to process `1042` using the `kill` command.',
    hints: [
      'Use the `kill` command followed by the PID.',
      'Target PID: 1042.',
      'Type `kill 1042`.'
    ],
    solution: 'kill 1042',
    explanation: '`kill <PID>` sends SIGTERM (signal 15) by default, politely requesting the process to clean up resources and terminate.',
    validate: (vfs) => {
      const proc = vfs.processes.find((p) => p.pid === 1042);
      if (!proc) {
        return { passed: true, message: 'Verified: Process 1042 terminated.' };
      }
      return { passed: false, message: 'Process 1042 is still running in the process table.' };
    }
  },
  {
    id: 29,
    slug: 'check-system-memory',
    category: 'processes',
    categoryTitle: 'Processes & Lifecycle',
    title: 'Check System Memory and Swap Usage',
    difficulty: 'Beginner',
    xp: 70,
    scenario: 'Check overall system RAM, cache/buffer allocation, and swap utilization.',
    objective: 'Run `free -m` or `free -h` to inspect memory consumption.',
    hints: [
      'Use the `free` command.',
      'The `-m` option shows megabytes, and `-h` shows human-readable format.',
      'Type `free -m`.'
    ],
    solution: 'free -m',
    explanation: '`free` reads `/proc/meminfo` to display total, used, free, shared, buffer/cache, and available memory.',
    validate: (_vfs, lastOutput, lastCommand) => {
      if (lastCommand.startsWith('free') && lastOutput.stdout.includes('Mem:')) {
        return { passed: true, message: 'Verified: System memory metrics rendered.' };
      }
      return { passed: false, message: 'Run `free -m` or `free -h`.' };
    }
  },

  // ----------------------------------------------------
  // 5. Networking (30 - 35)
  // ----------------------------------------------------
  {
    id: 30,
    slug: 'ip-show-addresses',
    category: 'networking',
    categoryTitle: 'Cloud Networking',
    title: 'Display Network Interfaces and IP Addresses',
    difficulty: 'Beginner',
    xp: 70,
    scenario: 'You need to find the internal private IP assigned to `eth0` on this cloud instance.',
    objective: 'Run the modern iproute2 command to list all network interface addresses.',
    hints: [
      'Use the `ip` command.',
      'Use `ip addr` or shorthand `ip a`.',
      'Type `ip addr`.'
    ],
    solution: 'ip addr',
    explanation: '`ip addr` (from the iproute2 suite) replaces legacy `ifconfig`, reporting IPv4/IPv6 addresses, subnet masks, MTU, and interface link states.',
    validate: (_vfs, lastOutput, lastCommand) => {
      if (lastCommand.startsWith('ip') && (lastCommand.includes('a') || lastCommand.includes('addr')) && lastOutput.stdout.includes('10.0.4.120')) {
        return { passed: true, message: 'Verified: Interface addresses and subnet details displayed.' };
      }
      return { passed: false, message: 'Run `ip addr` or `ip a`.' };
    }
  },
  {
    id: 31,
    slug: 'ping-test-connectivity',
    category: 'networking',
    categoryTitle: 'Cloud Networking',
    title: 'Test ICMP Connectivity with ping',
    difficulty: 'Beginner',
    xp: 70,
    scenario: 'Test outbound packet round-trip time to Google public DNS (`8.8.8.8`).',
    objective: 'Send ICMP echo requests to `8.8.8.8` using `ping -c 3 8.8.8.8`.',
    hints: [
      'Use `ping` with the count option `-c`.',
      'Specify 3 packets and IP 8.8.8.8.',
      'Type `ping -c 3 8.8.8.8`.'
    ],
    solution: 'ping -c 3 8.8.8.8',
    explanation: '`ping` sends ICMP ECHO_REQUEST datagrams to verify host reachability and measure network round-trip latency.',
    validate: (_vfs, lastOutput, lastCommand) => {
      if (lastCommand.includes('ping') && (lastCommand.includes('8.8.8.8') || lastCommand.includes('google.com')) && lastOutput.stdout.includes('bytes from')) {
        return { passed: true, message: 'Verified: ICMP packets transmitted and acknowledged.' };
      }
      return { passed: false, message: 'Run `ping -c 3 8.8.8.8`.' };
    }
  },
  {
    id: 32,
    slug: 'ss-inspect-ports',
    category: 'networking',
    categoryTitle: 'Cloud Networking',
    title: 'Inspect Listening Sockets and Open Ports',
    difficulty: 'Intermediate',
    xp: 90,
    scenario: 'Determine which TCP ports are actively listening on the host.',
    objective: 'Use `ss -tuln` to view listening TCP and UDP sockets with numeric port formatting.',
    hints: [
      'Use the socket statistics command `ss`.',
      'Flags: `-t` (tcp), `-u` (udp), `-l` (listening), `-n` (numeric ports).',
      'Type `ss -tuln`.'
    ],
    solution: 'ss -tuln',
    explanation: '`ss -tuln` provides fast socket diagnostics, showing ports like 22 (SSH), 80 (HTTP), and 8080 (Application server).',
    validate: (_vfs, lastOutput, lastCommand) => {
      if (lastCommand.startsWith('ss') && lastCommand.includes('tuln') && lastOutput.stdout.includes('LISTEN')) {
        return { passed: true, message: 'Verified: Listening sockets identified on ports 22, 80, and 8080.' };
      }
      return { passed: false, message: 'Run `ss -tuln`.' };
    }
  },
  {
    id: 33,
    slug: 'curl-probe-health',
    category: 'networking',
    categoryTitle: 'Cloud Networking',
    title: 'Probe an HTTP Microservice with curl',
    difficulty: 'Intermediate',
    xp: 80,
    scenario: 'Test the internal microservice running on port 8080 by querying its health endpoint.',
    objective: 'Send an HTTP GET request to `http://localhost:8080/health` using `curl`.',
    hints: [
      'Use the `curl` tool.',
      'Target URL: `http://localhost:8080/health`.',
      'Type `curl http://localhost:8080/health`.'
    ],
    solution: 'curl http://localhost:8080/health',
    explanation: '`curl` is the gold-standard command-line tool for transferring data over HTTP, HTTPS, FTP, and other protocols in automated workflows.',
    validate: (_vfs, lastOutput, lastCommand) => {
      if (lastCommand.startsWith('curl') && lastCommand.includes('8080') && lastOutput.stdout.includes('healthy')) {
        return { passed: true, message: 'Verified: HTTP 200 payload received from microservice.' };
      }
      return { passed: false, message: 'Run `curl http://localhost:8080/health`.' };
    }
  },
  {
    id: 34,
    slug: 'curl-inspect-headers',
    category: 'networking',
    categoryTitle: 'Cloud Networking',
    title: 'Inspect HTTP Response Headers',
    difficulty: 'Intermediate',
    xp: 80,
    scenario: 'Verify HTTP status code and response headers without downloading the response body.',
    objective: 'Fetch only the HTTP headers for `http://localhost:8080/health` using `curl -I`.',
    hints: [
      'The `-I` (or `--head`) flag retrieves headers only.',
      'Type `curl -I http://localhost:8080/health`.'
    ],
    solution: 'curl -I http://localhost:8080/health',
    explanation: 'Sending a HEAD request with `curl -I` saves bandwidth while inspecting cache-control, content-type, server banners, and status codes.',
    validate: (_vfs, lastOutput, lastCommand) => {
      if (lastCommand.startsWith('curl') && lastCommand.includes('-I') && lastOutput.stdout.includes('HTTP/1.1 200 OK')) {
        return { passed: true, message: 'Verified: Response headers retrieved.' };
      }
      return { passed: false, message: 'Run `curl -I http://localhost:8080/health`.' };
    }
  },
  {
    id: 35,
    slug: 'dns-inspect-resolv',
    category: 'networking',
    categoryTitle: 'Cloud Networking',
    title: 'Inspect DNS Configuration',
    difficulty: 'Intermediate',
    xp: 80,
    scenario: 'Investigate which nameservers this host queries for domain name resolution.',
    objective: 'Inspect the system resolver configuration file `/etc/resolv.conf`.',
    hints: [
      'Use `cat` on the system DNS resolver file.',
      'Path: `/etc/resolv.conf`.',
      'Type `cat /etc/resolv.conf`.'
    ],
    solution: 'cat /etc/resolv.conf',
    explanation: '`/etc/resolv.conf` configures DNS nameservers and search domains used by the C library resolver subsystem.',
    validate: (_vfs, lastOutput, lastCommand) => {
      if (lastCommand.includes('cat') && lastCommand.includes('/etc/resolv.conf') && lastOutput.stdout.includes('nameserver')) {
        return { passed: true, message: 'Verified: Configured nameservers displayed.' };
      }
      return { passed: false, message: 'Run `cat /etc/resolv.conf`.' };
    }
  },

  // ----------------------------------------------------
  // 6. Text Processing (36 - 44)
  // ----------------------------------------------------
  {
    id: 36,
    slug: 'grep-http-500',
    category: 'text',
    categoryTitle: 'Stream & Text Processing',
    title: 'Filter HTTP 500 Internal Server Errors',
    difficulty: 'Intermediate',
    xp: 80,
    scenario: 'Customers reported checkout issues. Filter `logs/access.log` for HTTP 500 status responses.',
    objective: 'Search for all log lines containing "500" in `logs/access.log`.',
    hints: [
      'Use `grep "500"` on the access log.',
      'Type `grep "500" logs/access.log`.'
    ],
    solution: 'grep "500" logs/access.log',
    explanation: 'Filtering web server access logs for 5xx codes identifies fatal upstream application exceptions.',
    validate: (_vfs, lastOutput, lastCommand) => {
      if (lastCommand.includes('grep') && lastCommand.includes('500') && lastOutput.stdout.includes('POST /checkout')) {
        return { passed: true, message: 'Verified: HTTP 500 incident records extracted.' };
      }
      return { passed: false, message: 'Run `grep "500" logs/access.log`.' };
    }
  },
  {
    id: 37,
    slug: 'sort-file-lines',
    category: 'text',
    categoryTitle: 'Stream & Text Processing',
    title: 'Sort Records Alphabetically',
    difficulty: 'Beginner',
    xp: 70,
    scenario: 'Sort the entries in `users.txt` in alphabetical order.',
    objective: 'Run the `sort` command on `users.txt`.',
    hints: [
      'Use the `sort` utility.',
      'Type `sort users.txt`.'
    ],
    solution: 'sort users.txt',
    explanation: '`sort` orders lines of text alphabetically or numerically, frequently used before calling `uniq`.',
    validate: (_vfs, lastOutput, lastCommand) => {
      if (lastCommand.startsWith('sort') && lastCommand.includes('users.txt') && lastOutput.stdout.includes('bin:x:2:2')) {
        return { passed: true, message: 'Verified: Alphabetical order achieved.' };
      }
      return { passed: false, message: 'Run `sort users.txt`.' };
    }
  },
  {
    id: 38,
    slug: 'uniq-count-occurrences',
    category: 'text',
    categoryTitle: 'Stream & Text Processing',
    title: 'Deduplicate and Count Duplicate Lines',
    difficulty: 'Intermediate',
    xp: 90,
    scenario: 'Count how many times each IP appears in the access log.',
    objective: 'Extract client IPs from `logs/access.log` using `awk`, sort them, and pipe into `uniq -c`.',
    hints: [
      'Piping `awk \'{print $1}\' logs/access.log | sort | uniq -c`.',
      'Or simply pipe `cut -d" " -f1 logs/access.log | sort | uniq -c`.',
      'Type `awk \'{print $1}\' logs/access.log | sort | uniq -c`.'
    ],
    solution: "awk '{print $1}' logs/access.log | sort | uniq -c",
    explanation: 'Because `uniq` only merges adjacent duplicate lines, input must always be sorted first.',
    validate: (_vfs, lastOutput, lastCommand) => {
      if (lastCommand.includes('uniq') && (lastCommand.includes('-c') || lastCommand.includes('|')) && lastOutput.stdout.includes('192.168.1.10')) {
        return { passed: true, message: 'Verified: Unique IP distribution calculated.' };
      }
      return { passed: false, message: "Run `awk '{print $1}' logs/access.log | sort | uniq -c`." };
    }
  },
  {
    id: 39,
    slug: 'cut-delimiter-fields',
    category: 'text',
    categoryTitle: 'Stream & Text Processing',
    title: 'Extract Usernames from /etc/passwd Structure',
    difficulty: 'Intermediate',
    xp: 80,
    scenario: '`users.txt` is colon-separated like `/etc/passwd`. Extract only the usernames (field 1).',
    objective: 'Use `cut` with delimiter `:` and field `1` on `users.txt`.',
    hints: [
      'Use `cut -d: -f1 users.txt` or `cut -d ":" -f 1 users.txt`.',
      'Type `cut -d: -f1 users.txt`.'
    ],
    solution: 'cut -d: -f1 users.txt',
    explanation: '`cut` cuts out selected fields or columns from each line of a delimited file.',
    validate: (_vfs, lastOutput, lastCommand) => {
      if (lastCommand.startsWith('cut') && lastCommand.includes('-f') && lastOutput.stdout.includes('sai') && lastOutput.stdout.includes('root')) {
        return { passed: true, message: 'Verified: Usernames cleanly extracted without delimiters.' };
      }
      return { passed: false, message: 'Run `cut -d: -f1 users.txt`.' };
    }
  },
  {
    id: 40,
    slug: 'wc-count-lines',
    category: 'text',
    categoryTitle: 'Stream & Text Processing',
    title: 'Count Total Lines in a File',
    difficulty: 'Beginner',
    xp: 60,
    scenario: 'Determine the total number of lines in `logs/application.log`.',
    objective: 'Use `wc -l` to count the lines in `logs/application.log`.',
    hints: [
      'Use `wc` with `-l`.',
      'Type `wc -l logs/application.log`.'
    ],
    solution: 'wc -l logs/application.log',
    explanation: '`wc -l` counts newline characters, providing an instantaneous metric for dataset or log size.',
    validate: (_vfs, lastOutput, lastCommand) => {
      if (lastCommand.includes('wc') && lastCommand.includes('-l') && lastCommand.includes('application.log') && /\d+/.test(lastOutput.stdout)) {
        return { passed: true, message: 'Verified: Line count calculated.' };
      }
      return { passed: false, message: 'Run `wc -l logs/application.log`.' };
    }
  },
  {
    id: 41,
    slug: 'sed-stream-replace',
    category: 'text',
    categoryTitle: 'Stream & Text Processing',
    title: 'Stream Replacement with sed',
    difficulty: 'Advanced',
    xp: 100,
    scenario: 'Preview changing `staging` to `production` in `config.txt` without editing the file by hand.',
    objective: 'Use `sed "s/staging/production/g" config.txt` to stream substitute the environment setting.',
    hints: [
      'Use `sed` with substitution command `s/search/replace/g`.',
      'Type `sed "s/staging/production/g" config.txt`.'
    ],
    solution: 'sed "s/staging/production/g" config.txt',
    explanation: '`sed` (stream editor) performs automated transformations on an input stream using pattern matching and substitution rules.',
    validate: (_vfs, lastOutput, lastCommand) => {
      if (lastCommand.includes('sed') && lastCommand.includes('s/staging/production/g') && lastOutput.stdout.includes('ENVIRONMENT=production')) {
        return { passed: true, message: 'Verified: Stream substitution successful.' };
      }
      return { passed: false, message: 'Run `sed "s/staging/production/g" config.txt`.' };
    }
  },
  {
    id: 42,
    slug: 'awk-extract-columns',
    category: 'text',
    categoryTitle: 'Stream & Text Processing',
    title: 'Extract Columns Using awk',
    difficulty: 'Advanced',
    xp: 100,
    scenario: 'Extract the client IP ($1) and HTTP response status ($9) from `logs/access.log`.',
    objective: 'Run `awk \'{print $1, $9}\' logs/access.log`.',
    hints: [
      'awk splits fields by whitespace into positional variables $1, $2, etc.',
      'Type `awk \'{print $1, $9}\' logs/access.log`.'
    ],
    solution: "awk '{print $1, $9}' logs/access.log",
    explanation: '`awk` is a complete pattern-scanning and text-processing language ideal for extracting whitespace-delimited columns.',
    validate: (_vfs, lastOutput, lastCommand) => {
      if (lastCommand.includes('awk') && lastCommand.includes('$1') && lastCommand.includes('$9') && lastOutput.stdout.includes('192.168.1.10 200')) {
        return { passed: true, message: 'Verified: IP and status columns parsed.' };
      }
      return { passed: false, message: "Run `awk '{print $1, $9}' logs/access.log`." };
    }
  },
  {
    id: 43,
    slug: 'pipes-complex-chain',
    category: 'text',
    categoryTitle: 'Stream & Text Processing',
    title: 'Chain Commands with Pipes',
    difficulty: 'Intermediate',
    xp: 90,
    scenario: 'Count how many 404 Not Found error responses exist in `logs/access.log`.',
    objective: 'Pipeline `cat logs/access.log | grep 404 | wc -l`.',
    hints: [
      'Chain `cat`, `grep 404`, and `wc -l`.',
      'Type `cat logs/access.log | grep 404 | wc -l`.'
    ],
    solution: 'cat logs/access.log | grep 404 | wc -l',
    explanation: 'Unix pipelines connect stdout of one program to stdin of the next, enabling modular composition.',
    validate: (_vfs, lastOutput, lastCommand) => {
      if (lastCommand.includes('404') && lastCommand.includes('wc -l') && /\d+/.test(lastOutput.stdout)) {
        return { passed: true, message: 'Verified: 404 errors counted.' };
      }
      return { passed: false, message: 'Run `cat logs/access.log | grep 404 | wc -l`.' };
    }
  },
  {
    id: 44,
    slug: 'redirection-append-log',
    category: 'text',
    categoryTitle: 'Stream & Text Processing',
    title: 'Append Data Using Redirection (>>)',
    difficulty: 'Beginner',
    xp: 70,
    scenario: 'Add a new configuration parameter `ENABLE_TELEMETRY=true` to the end of `config.txt`.',
    objective: 'Use `echo "ENABLE_TELEMETRY=true" >> config.txt` to append without overwriting existing settings.',
    hints: [
      'Use the append operator `>>` (double greater-than).',
      'Type `echo "ENABLE_TELEMETRY=true" >> config.txt`.'
    ],
    solution: 'echo "ENABLE_TELEMETRY=true" >> config.txt',
    explanation: '`>>` appends stdout to the target file, whereas single `>` truncates and overwrites it.',
    validate: (vfs) => {
      const node = vfs.resolvePathNode('/home/sai/config.txt');
      if (node && node.content && node.content.includes('ENABLE_TELEMETRY=true')) {
        return { passed: true, message: 'Verified: Config parameter appended.' };
      }
      return { passed: false, message: 'ENABLE_TELEMETRY=true not found in config.txt.' };
    }
  },

  // ----------------------------------------------------
  // 7. Bash (45 - 53)
  // ----------------------------------------------------
  {
    id: 45,
    slug: 'bash-variables',
    category: 'bash',
    categoryTitle: 'Bash Shell & Scripting',
    title: 'Define and Print a Shell Variable',
    difficulty: 'Beginner',
    xp: 60,
    scenario: 'Set a temporary shell variable `CLUSTER_NAME=prod-east-1` and print it using `echo`.',
    objective: 'Assign `CLUSTER_NAME="prod-east-1"` and run `echo $CLUSTER_NAME`.',
    hints: [
      'In Bash, variables are assigned without spaces around `=`.',
      'Assign `CLUSTER_NAME=prod-east-1` and then `echo $CLUSTER_NAME`.',
      'Type `CLUSTER_NAME="prod-east-1"` then `echo $CLUSTER_NAME`.'
    ],
    solution: 'CLUSTER_NAME="prod-east-1" && echo $CLUSTER_NAME',
    explanation: 'Bash variables are created with `NAME=value` and referenced with `$NAME` or `${NAME}`.',
    validate: (vfs, lastOutput) => {
      if (vfs.env.get('CLUSTER_NAME') === 'prod-east-1' || lastOutput.stdout.includes('prod-east-1')) {
        return { passed: true, message: 'Verified: CLUSTER_NAME set and evaluated.' };
      }
      return { passed: false, message: 'Variable CLUSTER_NAME was not set to prod-east-1.' };
    }
  },
  {
    id: 46,
    slug: 'bash-export-env',
    category: 'bash',
    categoryTitle: 'Bash Shell & Scripting',
    title: 'Export an Environment Variable',
    difficulty: 'Intermediate',
    xp: 80,
    scenario: 'Export `ENVIRONMENT=production` so that any child processes inherit the environment configuration.',
    objective: 'Run `export ENVIRONMENT=production` in your shell.',
    hints: [
      'Use the `export` built-in.',
      'Type `export ENVIRONMENT=production`.'
    ],
    solution: 'export ENVIRONMENT=production',
    explanation: '`export` marks shell variables to be exported to the environment of subsequently executed commands.',
    validate: (vfs) => {
      if (vfs.env.get('ENVIRONMENT') === 'production') {
        return { passed: true, message: 'Verified: ENVIRONMENT exported to shell context.' };
      }
      return { passed: false, message: 'Run `export ENVIRONMENT=production`.' };
    }
  },
  {
    id: 47,
    slug: 'bash-exit-codes',
    category: 'bash',
    categoryTitle: 'Bash Shell & Scripting',
    title: 'Inspect Command Exit Status ($?)',
    difficulty: 'Intermediate',
    xp: 80,
    scenario: 'Every Linux command returns an exit status (0 for success, non-zero for failure). Check the exit code of the last command.',
    objective: 'Run `echo $?` to inspect the return code.',
    hints: [
      'Special shell parameter `$?` contains the exit status.',
      'Type `echo $?`.'
    ],
    solution: 'echo $?',
    explanation: 'Exit code 0 indicates success. 1 to 255 indicate specific error codes, critical for conditional pipeline flows.',
    validate: (_vfs, lastOutput, lastCommand) => {
      if (lastCommand.trim() === 'echo $?' && lastOutput.stdout.trim() === '0') {
        return { passed: true, message: 'Verified: Exit code 0 displayed.' };
      }
      return { passed: false, message: 'Run `echo $?`.' };
    }
  },
  {
    id: 48,
    slug: 'bash-create-script',
    category: 'bash',
    categoryTitle: 'Bash Shell & Scripting',
    title: 'Write a Hello CloudOps Script',
    difficulty: 'Intermediate',
    xp: 90,
    scenario: 'Create a new script named `scripts/greet.sh` with a shebang line and an echo greeting.',
    objective: 'Write `#!/bin/bash\\necho "Welcome to CloudOps"` into `scripts/greet.sh`.',
    hints: [
      'Use `echo` with redirection `>`.',
      'Or `printf "#!/bin/bash\\necho \\"Welcome to CloudOps\\"\\n" > scripts/greet.sh`.',
      'Type `echo \'#!/bin/bash\\necho "Welcome to CloudOps"\' > scripts/greet.sh`.'
    ],
    solution: 'echo \'#!/bin/bash\necho "Welcome to CloudOps"\' > scripts/greet.sh',
    explanation: 'A script file must start with a shebang `#!/bin/bash` declaring the absolute path of the interpreter.',
    validate: (vfs) => {
      const node = vfs.resolvePathNode('/home/sai/scripts/greet.sh');
      if (node && node.content && node.content.includes('Welcome to CloudOps')) {
        return { passed: true, message: 'Verified: scripts/greet.sh created.' };
      }
      return { passed: false, message: 'scripts/greet.sh not found or missing greeting.' };
    }
  },
  {
    id: 49,
    slug: 'bash-conditional-check',
    category: 'bash',
    categoryTitle: 'Bash Shell & Scripting',
    title: 'Test File Existence in Bash',
    difficulty: 'Intermediate',
    xp: 90,
    scenario: 'Test if `/home/sai/config.txt` exists using the `test` or `[` built-in.',
    objective: 'Run `[ -f config.txt ] && echo "Config exists"`.',
    hints: [
      '`-f` tests whether a regular file exists.',
      'Type `[ -f config.txt ] && echo "Config exists"`.'
    ],
    solution: '[ -f config.txt ] && echo "Config exists"',
    explanation: 'The `test` operator `[ -f file ]` checks file existence, allowing short-circuit execution with `&&`.',
    validate: (_vfs, lastOutput, lastCommand) => {
      if (lastCommand.includes('-f') && lastOutput.stdout.includes('Config exists')) {
        return { passed: true, message: 'Verified: Conditional file test passed.' };
      }
      return { passed: false, message: 'Run `[ -f config.txt ] && echo "Config exists"`.' };
    }
  },
  {
    id: 50,
    slug: 'bash-for-loop',
    category: 'bash',
    categoryTitle: 'Bash Shell & Scripting',
    title: 'Run a Loop in Bash',
    difficulty: 'Intermediate',
    xp: 90,
    scenario: 'Print the numbers 1, 2, and 3 using an inline bash for loop.',
    objective: 'Run `for i in 1 2 3; do echo "Node $i"; done`.',
    hints: [
      'Use the standard bash `for ... do ... done` syntax.',
      'Type `for i in 1 2 3; do echo "Node $i"; done`.'
    ],
    solution: 'for i in 1 2 3; do echo "Node $i"; done',
    explanation: 'Bash for loops iterate across whitespace-separated lists or file patterns.',
    validate: (_vfs, lastOutput, lastCommand) => {
      if (lastCommand.includes('for') && (lastOutput.stdout.includes('Node 1') || lastOutput.stdout.includes('1'))) {
        return { passed: true, message: 'Verified: Loop iteration executed.' };
      }
      return { passed: false, message: 'Run `for i in 1 2 3; do echo "Node $i"; done`.' };
    }
  },
  {
    id: 51,
    slug: 'bash-command-substitution',
    category: 'bash',
    categoryTitle: 'Bash Shell & Scripting',
    title: 'Use Command Substitution $(...)',
    difficulty: 'Advanced',
    xp: 100,
    scenario: 'Capture the current working directory dynamically in a variable using command substitution.',
    objective: 'Run `CURRENT_DIR=$(pwd) && echo $CURRENT_DIR`.',
    hints: [
      'Command substitution uses `$(command)`.',
      'Type `CURRENT_DIR=$(pwd) && echo $CURRENT_DIR`.'
    ],
    solution: 'CURRENT_DIR=$(pwd) && echo $CURRENT_DIR',
    explanation: '`$(cmd)` executes `cmd` in a subshell and replaces the expression with its standard output.',
    validate: (_vfs, lastOutput, lastCommand) => {
      if (lastCommand.includes('$(pwd)') && lastOutput.stdout.includes('/home/sai')) {
        return { passed: true, message: 'Verified: Command substitution captured pwd.' };
      }
      return { passed: false, message: 'Run `CURRENT_DIR=$(pwd) && echo $CURRENT_DIR`.' };
    }
  },
  {
    id: 52,
    slug: 'bash-make-executable-run',
    category: 'bash',
    categoryTitle: 'Bash Shell & Scripting',
    title: 'Execute Newly Created Script',
    difficulty: 'Intermediate',
    xp: 90,
    scenario: 'Make the greeting script `scripts/greet.sh` executable and execute it with `./scripts/greet.sh`.',
    objective: 'Run `chmod +x scripts/greet.sh` and then `./scripts/greet.sh`.',
    hints: [
      'First: `chmod +x scripts/greet.sh`.',
      'Second: `./scripts/greet.sh`.',
      'Type `chmod +x scripts/greet.sh && ./scripts/greet.sh`.'
    ],
    solution: 'chmod +x scripts/greet.sh && ./scripts/greet.sh',
    explanation: 'Executing scripts requires both the `+x` bit and specifying the relative path `./` since `.` is not in `$PATH` for security.',
    validate: (vfs) => {
      const node = vfs.resolvePathNode('/home/sai/scripts/greet.sh');
      if (node && (node.permissions & 0o111)) {
        return { passed: true, message: 'Verified: greet.sh is executable and runnable.' };
      }
      return { passed: false, message: 'scripts/greet.sh is not marked executable.' };
    }
  },
  {
    id: 53,
    slug: 'bash-production-healthcheck-audit',
    category: 'bash',
    categoryTitle: 'Bash Shell & Scripting',
    title: 'Audit and Run Production Healthcheck Suite',
    difficulty: 'Advanced',
    xp: 150,
    scenario: 'Capstone challenge! Execute the automated production healthcheck suite `./scripts/healthcheck.sh` to confirm cluster readiness.',
    objective: 'Execute `./scripts/healthcheck.sh` and inspect its exit code with `echo $?`.',
    hints: [
      'Ensure `scripts/healthcheck.sh` is executable: `chmod +x scripts/healthcheck.sh`.',
      'Run `./scripts/healthcheck.sh`.',
      'Type `./scripts/healthcheck.sh`.'
    ],
    solution: './scripts/healthcheck.sh',
    explanation: 'Automated healthcheck scripts validate HTTP endpoints, database sockets, and daemon states in cloud auto-healing loops.',
    validate: (_vfs, lastOutput, lastCommand) => {
      if (lastCommand.includes('healthcheck.sh') && (lastOutput.stdout.includes('HEALTHY') || lastOutput.exitCode === 0)) {
        return { passed: true, message: 'Congratulations! All 53 Linux Practice Lab challenges mastered!' };
      }
      return { passed: false, message: 'Run `./scripts/healthcheck.sh`.' };
    }
  }
];
