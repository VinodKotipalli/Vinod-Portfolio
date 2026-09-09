// Unix Virtual File System (VFS) for Sandboxed Linux Practice Lab

export interface VFSNode {
  name: string;
  type: 'file' | 'directory';
  content?: string;
  permissions: number; // e.g. 0o755 (octal: 755)
  owner: string;
  group: string;
  size: number;
  modified: Date;
  children?: Map<string, VFSNode>;
}

export interface ProcessInfo {
  pid: number;
  user: string;
  cpu: number;
  mem: number;
  command: string;
  status: 'R' | 'S' | 'Z';
  startTime: string;
}

export class VirtualFileSystem {
  root: VFSNode;
  currentPath: string; // Absolute path, e.g. "/home/sai"
  currentUser: string;
  currentGroup: string;
  processes: ProcessInfo[];
  env: Map<string, string>;

  constructor() {
    this.currentUser = 'sai';
    this.currentGroup = 'sai';
    this.currentPath = '/home/sai';
    this.env = new Map<string, string>([
      ['USER', 'sai'],
      ['HOME', '/home/sai'],
      ['SHELL', '/bin/bash'],
      ['PATH', '/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin'],
      ['TERM', 'xterm-256color'],
      ['HOSTNAME', 'linux-lab'],
      ['LANG', 'en_US.UTF-8'],
    ]);

    this.processes = [
      { pid: 1, user: 'root', cpu: 0.0, mem: 0.1, command: '/sbin/init', status: 'S', startTime: '00:00' },
      { pid: 82, user: 'root', cpu: 0.0, mem: 0.2, command: '/lib/systemd/systemd-journald', status: 'S', startTime: '00:01' },
      { pid: 114, user: 'root', cpu: 0.1, mem: 0.4, command: '/usr/sbin/sshd -D', status: 'S', startTime: '00:01' },
      { pid: 340, user: 'www-data', cpu: 0.2, mem: 1.2, command: 'nginx: master process /usr/sbin/nginx', status: 'S', startTime: '00:05' },
      { pid: 341, user: 'www-data', cpu: 0.8, mem: 1.8, command: 'nginx: worker process', status: 'S', startTime: '00:05' },
      { pid: 512, user: 'sai', cpu: 0.1, mem: 0.5, command: '-bash', status: 'S', startTime: '00:10' },
      { pid: 1042, user: 'sai', cpu: 14.2, mem: 8.5, command: 'python3 /home/sai/scripts/worker.py --daemon', status: 'R', startTime: '00:12' },
      { pid: 1204, user: 'node', cpu: 1.5, mem: 4.2, command: 'node /home/sai/projects/app/server.js', status: 'S', startTime: '00:15' },
    ];

    this.root = this.createDefaultFilesystem();
  }

  createDefaultFilesystem(): VFSNode {
    const rootDir: VFSNode = {
      name: '',
      type: 'directory',
      permissions: 0o755,
      owner: 'root',
      group: 'root',
      size: 4096,
      modified: new Date(),
      children: new Map(),
    };

    // Helper to add directories
    const addDir = (parentPath: string, name: string, perm = 0o755, owner = 'root', group = 'root') => {
      const parent = this.resolvePathNode(parentPath, rootDir);
      if (parent && parent.children) {
        const dir: VFSNode = {
          name,
          type: 'directory',
          permissions: perm,
          owner,
          group,
          size: 4096,
          modified: new Date(),
          children: new Map(),
        };
        parent.children.set(name, dir);
      }
    };

    // Helper to add files
    const addFile = (parentPath: string, name: string, content: string, perm = 0o644, owner = 'sai', group = 'sai') => {
      const parent = this.resolvePathNode(parentPath, rootDir);
      if (parent && parent.children) {
        const file: VFSNode = {
          name,
          type: 'file',
          content,
          permissions: perm,
          owner,
          group,
          size: content.length,
          modified: new Date(),
        };
        parent.children.set(name, file);
      }
    };

    // Create root directories
    const baseDirs = ['bin', 'boot', 'dev', 'etc', 'home', 'lib', 'media', 'mnt', 'opt', 'proc', 'root', 'run', 'sbin', 'srv', 'sys', 'tmp', 'usr', 'var'];
    baseDirs.forEach((d) => {
      rootDir.children!.set(d, {
        name: d,
        type: 'directory',
        permissions: d === 'tmp' ? 0o777 : 0o755,
        owner: 'root',
        group: 'root',
        size: 4096,
        modified: new Date(),
        children: new Map(),
      });
    });

    // /home/sai
    addDir('/home', 'sai', 0o755, 'sai', 'sai');
    addDir('/home/sai', 'projects', 0o755, 'sai', 'sai');
    addDir('/home/sai/projects', 'app', 0o755, 'sai', 'sai');
    addDir('/home/sai', 'logs', 0o755, 'sai', 'sai');
    addDir('/home/sai', 'scripts', 0o755, 'sai', 'sai');
    addDir('/etc', 'nginx', 0o755, 'root', 'root');
    addDir('/etc', 'kubernetes', 0o755, 'root', 'root');
    addDir('/var', 'log', 0o755, 'root', 'root');
    addDir('/var/log', 'nginx', 0o755, 'www-data', 'www-data');
    addDir('/home/sai', 'k8s', 0o755, 'sai', 'sai');
    addDir('/home/sai', '.kube', 0o700, 'sai', 'sai');

    // /home/sai files
    addFile('/home/sai', 'README.md', `# DevOps & Kubernetes Practice Lab\n\nWelcome to your interactive Linux & Kubernetes environment!\nThis workspace is equipped with realistic DevOps project files, logs, automation scripts, and an active Kubernetes v1.30.2 cluster sandbox.\n\nPractice commands freely with 'kubectl' or complete the hands-on challenges!\n`, 0o644);
    addFile('/home/sai', 'config.txt', `ENVIRONMENT=staging\nREGION=us-east-1\nPORT=8080\nDEBUG=false\nMAX_CONNECTIONS=100\nDATABASE_URL=postgres://db.internal:5432/app\n`, 0o640);
    addFile('/home/sai', 'users.txt', `root:x:0:0:root:/root:/bin/bash\ndaemon:x:1:1:daemon:/usr/sbin:/usr/sbin/nologin\nbin:x:2:2:bin:/bin:/usr/sbin/nologin\nsys:x:3:3:sys:/dev:/usr/sbin/nologin\nwww-data:x:33:33:www-data:/var/www:/usr/sbin/nologin\nsai:x:1000:1000:Saivinod Kotipalli,,,:/home/sai:/bin/bash\ndevops:x:1001:1001:DevOps Engineer,,,:/home/devops:/bin/bash\n`, 0o644);

    // /home/sai/.kube
    addFile('/home/sai/.kube', 'config', `apiVersion: v1\nclusters:\n- cluster:\n    certificate-authority-data: LS0tLS1CRUdJTi...REDACTED\n    server: https://192.168.1.10:6443\n  name: devops-cluster-01\ncontexts:\n- context:\n    cluster: devops-cluster-01\n    user: kubernetes-admin\n    namespace: default\n  name: kubernetes-admin@devops-cluster-01\ncurrent-context: kubernetes-admin@devops-cluster-01\nkind: Config\nusers:\n- name: kubernetes-admin\n  user:\n    client-certificate-data: LS0tLS1CRUdJTi...REDACTED\n`, 0o600, 'sai', 'sai');

    // /home/sai/k8s manifests
    addFile('/home/sai/k8s', 'nginx-deployment.yaml', `apiVersion: apps/v1\nkind: Deployment\nmetadata:\n  name: nginx-web\n  namespace: default\n  labels:\n    app: nginx-web\nspec:\n  replicas: 3\n  selector:\n    matchLabels:\n      app: nginx-web\n  template:\n    metadata:\n      labels:\n        app: nginx-web\n    spec:\n      containers:\n      - name: nginx\n        image: nginx:1.27-alpine\n        ports:\n        - containerPort: 80\n        resources:\n          requests:\n            memory: "64Mi"\n            cpu: "100m"\n          limits:\n            memory: "128Mi"\n            cpu: "250m"\n`, 0o644, 'sai', 'sai');
    addFile('/home/sai/k8s', 'frontend-service.yaml', `apiVersion: v1\nkind: Service\nmetadata:\n  name: frontend-svc\n  namespace: default\nspec:\n  type: NodePort\n  selector:\n    app: frontend\n  ports:\n  - port: 80\n    targetPort: 80\n    nodePort: 30080\n`, 0o644, 'sai', 'sai');
    addFile('/home/sai/k8s', 'ingress.yaml', `apiVersion: networking.k8s.io/v1\nkind: Ingress\nmetadata:\n  name: main-ingress\n  namespace: default\nspec:\n  rules:\n  - host: app.cloudops.internal\n    http:\n      paths:\n      - path: /\n        pathType: Prefix\n        backend:\n          service:\n            name: frontend-svc\n            port:\n              number: 80\n`, 0o644, 'sai', 'sai');
    addFile('/home/sai/k8s', 'configmap.yaml', `apiVersion: v1\nkind: ConfigMap\nmetadata:\n  name: app-env-config\n  namespace: default\ndata:\n  API_URL: "https://api.cloudops.internal"\n  CACHE_ENABLED: "true"\n  LOG_LEVEL: "info"\n`, 0o644, 'sai', 'sai');

    // /home/sai/projects/app
    addFile('/home/sai/projects/app', 'server.js', `const express = require('express');\nconst app = express();\nconst PORT = process.env.PORT || 8080;\n\napp.get('/health', (req, res) => res.json({ status: 'healthy', uptime: process.uptime() }));\napp.get('/api/data', (req, res) => res.json({ message: 'Hello from CloudOps!' }));\n\napp.listen(PORT, () => console.log('App running on port ' + PORT));\n`, 0o644);
    addFile('/home/sai/projects/app', 'package.json', `{\n  "name": "cloudops-microservice",\n  "version": "1.4.0",\n  "main": "server.js",\n  "scripts": {\n    "start": "node server.js"\n  },\n  "dependencies": {\n    "express": "^4.19.2"\n  }\n}\n`, 0o644);
    addFile('/home/sai/projects/app', 'Dockerfile', `FROM node:20-alpine\nWORKDIR /usr/src/app\nCOPY package*.json ./\nRUN npm install --only=production\nCOPY . .\nEXPOSE 8080\nCMD ["node", "server.js"]\n`, 0o644);

    // /home/sai/logs
    addFile('/home/sai/logs', 'application.log', `2026-09-08 23:40:12 [INFO] Application initialized on port 8080\n2026-09-08 23:41:05 [INFO] Database pool connected to db.internal:5432\n2026-09-08 23:42:19 [WARN] High memory consumption detected: worker-pool-2\n2026-09-08 23:43:01 [ERROR] Connection timeout to payment-gateway:5004\n2026-09-08 23:44:15 [INFO] Retry connection successful for payment-gateway\n2026-09-08 23:45:22 [ERROR] Out of memory: unable to allocate buffer for streaming job\n2026-09-08 23:46:00 [INFO] Healthcheck probed: HTTP 200 OK\n2026-09-08 23:47:33 [ERROR] Disk write failure: /var/log/metrics.dump\n2026-09-08 23:48:10 [INFO] Graceful restart dispatched\n`, 0o644);
    addFile('/home/sai/logs', 'access.log', `192.168.1.10 - - [08/Sep/2026:23:40:12 +0000] "GET /health HTTP/1.1" 200 45\n192.168.1.15 - - [08/Sep/2026:23:41:02 +0000] "GET /api/v1/metrics HTTP/1.1" 200 1204\n192.168.1.42 - - [08/Sep/2026:23:41:45 +0000] "POST /api/v1/auth HTTP/1.1" 401 89\n10.0.4.120 - - [08/Sep/2026:23:42:10 +0000] "GET /api/v1/users HTTP/1.1" 200 5621\n10.0.4.120 - - [08/Sep/2026:23:43:00 +0000] "GET /admin/dashboard HTTP/1.1" 403 145\n172.16.0.8 - - [08/Sep/2026:23:44:22 +0000] "GET /assets/style.css HTTP/1.1" 404 220\n10.0.2.14 - - [08/Sep/2026:23:45:10 +0000] "POST /checkout HTTP/1.1" 500 512\n10.0.2.14 - - [08/Sep/2026:23:45:15 +0000] "POST /checkout HTTP/1.1" 500 512\n192.168.1.10 - - [08/Sep/2026:23:46:01 +0000] "GET /health HTTP/1.1" 200 45\n`, 0o644);

    // /home/sai/scripts
    addFile('/home/sai/scripts', 'deploy.sh', `#!/bin/bash\nset -e\necho "==> Deploying CloudOps Microservice..."\nIMAGE="cloudops-app:v1.4.0"\ndocker build -t $IMAGE /home/sai/projects/app\necho "==> Rolling update deployed successfully."\n`, 0o644);
    addFile('/home/sai/scripts', 'backup.sh', `#!/bin/bash\nDATE=$(date +%Y%m%d_%H%M%S)\nBACKUP_DIR="/tmp/backups"\nmkdir -p $BACKUP_DIR\ntar -czf "$BACKUP_DIR/backup_$DATE.tar.gz" /home/sai/projects/app\necho "Backup saved to $BACKUP_DIR/backup_$DATE.tar.gz"\n`, 0o644);
    addFile('/home/sai/scripts', 'healthcheck.sh', `#!/bin/bash\nSTATUS=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:8080/health || echo "DOWN")\nif [ "$STATUS" == "200" ]; then\n  echo "Service is HEALTHY"\n  exit 0\nelse\n  echo "Service is UNHEALTHY ($STATUS)"\n  exit 1\nfi\n`, 0o644);

    // /etc files
    addFile('/etc', 'os-release', `NAME="Ubuntu"\nVERSION="24.04 LTS (Noble Numbat)"\nID=ubuntu\nID_LIKE=debian\nPRETTY_NAME="Ubuntu 24.04 LTS"\nVERSION_ID="24.04"\nHOME_URL="https://www.ubuntu.com/"\nSUPPORT_URL="https://help.ubuntu.com/"\n`, 0o644, 'root', 'root');
    addFile('/etc', 'hosts', `127.0.0.1 localhost\n127.0.1.1 linux-lab\n10.0.0.50 db.internal\n10.0.0.60 payment-gateway\n`, 0o644, 'root', 'root');
    addFile('/etc', 'resolv.conf', `nameserver 8.8.8.8\nnameserver 1.1.1.1\nsearch internal.cloudops\n`, 0o644, 'root', 'root');
    addFile('/etc/nginx', 'nginx.conf', `events { worker_connections 1024; }\nhttp {\n    upstream backend {\n        server 127.0.0.1:8080;\n    }\n    server {\n        listen 80;\n        location / {\n            proxy_pass http://backend;\n        }\n    }\n}\n`, 0o644, 'root', 'root');

    return rootDir;
  }

  // Clone VFS for reset / isolated sessions
  clone(): VirtualFileSystem {
    const newFs = new VirtualFileSystem();
    newFs.root = JSON.parse(JSON.stringify(this.root, (key, value) => {
      if (value instanceof Map) {
        return { _isMap: true, entries: Array.from(value.entries()) };
      }
      return value;
    }));
    // Rebuild Maps
    const reviveMaps = (node: any) => {
      if (node.children && node.children._isMap) {
        node.children = new Map(node.children.entries.map(([k, v]: [string, any]) => [k, reviveMaps(v)]));
      }
      if (node.modified) {
        node.modified = new Date(node.modified);
      }
      return node;
    };
    newFs.root = reviveMaps(newFs.root);
    newFs.currentPath = this.currentPath;
    newFs.currentUser = this.currentUser;
    newFs.currentGroup = this.currentGroup;
    newFs.processes = JSON.parse(JSON.stringify(this.processes));
    return newFs;
  }

  // Path normalization
  normalizePath(targetPath: string): string {
    if (!targetPath) return this.currentPath;
    let raw = targetPath.trim();
    if (raw.startsWith('~')) {
      raw = '/home/sai' + raw.slice(1);
    }
    const isAbsolute = raw.startsWith('/');
    const base = isAbsolute ? '' : this.currentPath;
    const parts = `${base}/${raw}`.split('/').filter(Boolean);
    const resolved: string[] = [];

    for (const part of parts) {
      if (part === '.') continue;
      if (part === '..') {
        resolved.pop();
      } else {
        resolved.push(part);
      }
    }
    return '/' + resolved.join('/');
  }

  // Resolve node from root
  resolvePathNode(pathStr: string, startNode = this.root): VFSNode | null {
    const normalized = this.normalizePath(pathStr);
    if (normalized === '/' || normalized === '') return startNode;

    const parts = normalized.split('/').filter(Boolean);
    let curr: VFSNode = startNode;

    for (const part of parts) {
      if (!curr.children || curr.type !== 'directory') return null;
      const next = curr.children.get(part);
      if (!next) return null;
      curr = next;
    }
    return curr;
  }

  // Get parent node and target filename
  getParentNode(pathStr: string): { parent: VFSNode | null; basename: string; fullPath: string } {
    const normalized = this.normalizePath(pathStr);
    const parts = normalized.split('/').filter(Boolean);
    if (parts.length === 0) {
      return { parent: null, basename: '', fullPath: '/' };
    }
    const basename = parts.pop()!;
    const parentPath = '/' + parts.join('/');
    const parent = this.resolvePathNode(parentPath);
    return { parent, basename, fullPath: normalized };
  }

  // Convert octal permission (e.g. 0o755) to ls -l string (e.g. "rwxr-xr-x")
  static formatPermissions(perm: number, isDir: boolean): string {
    const prefix = isDir ? 'd' : '-';
    const rwx = (val: number) => {
      let s = '';
      s += (val & 4) ? 'r' : '-';
      s += (val & 2) ? 'w' : '-';
      s += (val & 1) ? 'x' : '-';
      return s;
    };
    const user = rwx((perm >> 6) & 7);
    const group = rwx((perm >> 3) & 7);
    const other = rwx(perm & 7);
    return prefix + user + group + other;
  }

  // Parse numeric chmod permission e.g. "755", "644"
  static parseNumericChmod(str: string): number | null {
    if (!/^[0-7]{3,4}$/.test(str)) return null;
    return parseInt(str, 8);
  }
}
