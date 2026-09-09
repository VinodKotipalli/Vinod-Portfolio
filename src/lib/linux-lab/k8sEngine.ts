// Interactive Kubernetes Engine for Sandboxed DevOps Practice Lab
import { VirtualFileSystem } from './vfs';
import { CommandOutput } from './commandEngine';

export interface K8sNode {
  name: string;
  status: 'Ready' | 'NotReady';
  roles: string;
  age: string;
  version: string;
  internalIP: string;
  osImage: string;
  kernelVersion: string;
  containerRuntime: string;
  cpu: string;
  memory: string;
}

export interface K8sPod {
  name: string;
  namespace: string;
  ready: string;
  status: 'Running' | 'Pending' | 'Terminating' | 'CrashLoopBackOff';
  restarts: number;
  age: string;
  ip: string;
  node: string;
  labels: Record<string, string>;
  image: string;
  deployment?: string;
}

export interface K8sDeployment {
  name: string;
  namespace: string;
  ready: string;
  upToDate: number;
  available: number;
  desired: number;
  age: string;
  image: string;
  port: number;
  selector: string;
}

export interface K8sService {
  name: string;
  namespace: string;
  type: 'ClusterIP' | 'NodePort' | 'LoadBalancer';
  clusterIP: string;
  externalIP: string;
  ports: string;
  age: string;
  selector: string;
}

export interface K8sConfigMap {
  name: string;
  namespace: string;
  dataCount: number;
  age: string;
  data: Record<string, string>;
}

export interface K8sIngress {
  name: string;
  namespace: string;
  hosts: string;
  address: string;
  ports: string;
  age: string;
}

export class KubernetesCluster {
  nodes: K8sNode[] = [];
  pods: K8sPod[] = [];
  deployments: K8sDeployment[] = [];
  services: K8sService[] = [];
  configMaps: K8sConfigMap[] = [];
  ingresses: K8sIngress[] = [];
  currentNamespace: string = 'default';
  clusterName: string = 'devops-cluster-01';

  constructor() {
    this.resetToDefaultState();
  }

  resetToDefaultState() {
    this.currentNamespace = 'default';

    this.nodes = [
      {
        name: 'k8s-control-plane-01',
        status: 'Ready',
        roles: 'control-plane',
        age: '12d',
        version: 'v1.30.2',
        internalIP: '192.168.1.10',
        osImage: 'Ubuntu 24.04 LTS',
        kernelVersion: '6.8.0-40-generic',
        containerRuntime: 'containerd://1.7.13',
        cpu: '4',
        memory: '8Gi',
      },
      {
        name: 'k8s-worker-node-01',
        status: 'Ready',
        roles: 'worker',
        age: '12d',
        version: 'v1.30.2',
        internalIP: '192.168.1.21',
        osImage: 'Ubuntu 24.04 LTS',
        kernelVersion: '6.8.0-40-generic',
        containerRuntime: 'containerd://1.7.13',
        cpu: '8',
        memory: '16Gi',
      },
      {
        name: 'k8s-worker-node-02',
        status: 'Ready',
        roles: 'worker',
        age: '12d',
        version: 'v1.30.2',
        internalIP: '192.168.1.22',
        osImage: 'Ubuntu 24.04 LTS',
        kernelVersion: '6.8.0-40-generic',
        containerRuntime: 'containerd://1.7.13',
        cpu: '8',
        memory: '16Gi',
      },
    ];

    this.deployments = [
      {
        name: 'frontend',
        namespace: 'default',
        ready: '2/2',
        upToDate: 2,
        available: 2,
        desired: 2,
        age: '3d4h',
        image: 'nginx:1.27-alpine',
        port: 80,
        selector: 'app=frontend',
      },
      {
        name: 'api-gateway',
        namespace: 'default',
        ready: '2/2',
        upToDate: 2,
        available: 2,
        desired: 2,
        age: '3d4h',
        image: 'node:20-alpine',
        port: 8080,
        selector: 'app=api-gateway',
      },
      {
        name: 'auth-service',
        namespace: 'default',
        ready: '1/1',
        upToDate: 1,
        available: 1,
        desired: 1,
        age: '2d18h',
        image: 'python:3.12-slim',
        port: 5000,
        selector: 'app=auth-service',
      },
      {
        name: 'coredns',
        namespace: 'kube-system',
        ready: '2/2',
        upToDate: 2,
        available: 2,
        desired: 2,
        age: '12d',
        image: 'registry.k8s.io/coredns/coredns:v1.11.1',
        port: 53,
        selector: 'k8s-app=kube-dns',
      },
    ];

    this.pods = [
      {
        name: 'frontend-75466bc679-2wqk1',
        namespace: 'default',
        ready: '1/1',
        status: 'Running',
        restarts: 0,
        age: '3d4h',
        ip: '10.244.1.14',
        node: 'k8s-worker-node-01',
        labels: { app: 'frontend', podTemplateHash: '75466bc679' },
        image: 'nginx:1.27-alpine',
        deployment: 'frontend',
      },
      {
        name: 'frontend-75466bc679-8dfl2',
        namespace: 'default',
        ready: '1/1',
        status: 'Running',
        restarts: 0,
        age: '3d4h',
        ip: '10.244.2.19',
        node: 'k8s-worker-node-02',
        labels: { app: 'frontend', podTemplateHash: '75466bc679' },
        image: 'nginx:1.27-alpine',
        deployment: 'frontend',
      },
      {
        name: 'api-gateway-5f78b84d9f-k2l9p',
        namespace: 'default',
        ready: '1/1',
        status: 'Running',
        restarts: 0,
        age: '3d4h',
        ip: '10.244.1.18',
        node: 'k8s-worker-node-01',
        labels: { app: 'api-gateway', podTemplateHash: '5f78b84d9f' },
        image: 'node:20-alpine',
        deployment: 'api-gateway',
      },
      {
        name: 'api-gateway-5f78b84d9f-9x7zm',
        namespace: 'default',
        ready: '1/1',
        status: 'Running',
        restarts: 0,
        age: '1d6h',
        ip: '10.244.2.20',
        node: 'k8s-worker-node-02',
        labels: { app: 'api-gateway', podTemplateHash: '5f78b84d9f' },
        image: 'node:20-alpine',
        deployment: 'api-gateway',
      },
      {
        name: 'auth-service-678dc8bf5b-p90zq',
        namespace: 'default',
        ready: '1/1',
        status: 'Running',
        restarts: 1,
        age: '2d18h',
        ip: '10.244.2.22',
        node: 'k8s-worker-node-02',
        labels: { app: 'auth-service', podTemplateHash: '678dc8bf5b' },
        image: 'python:3.12-slim',
        deployment: 'auth-service',
      },
      {
        name: 'redis-master-0',
        namespace: 'default',
        ready: '1/1',
        status: 'Running',
        restarts: 0,
        age: '12d',
        ip: '10.244.1.20',
        node: 'k8s-worker-node-01',
        labels: { app: 'redis', role: 'master' },
        image: 'redis:7.2-alpine',
      },
      {
        name: 'postgres-db-0',
        namespace: 'default',
        ready: '1/1',
        status: 'Running',
        restarts: 0,
        age: '12d',
        ip: '10.244.2.25',
        node: 'k8s-worker-node-02',
        labels: { app: 'postgres', role: 'database' },
        image: 'postgres:16-alpine',
      },
      // kube-system pods
      {
        name: 'coredns-7db6d8ff4d-27bvn',
        namespace: 'kube-system',
        ready: '1/1',
        status: 'Running',
        restarts: 0,
        age: '12d',
        ip: '10.244.0.2',
        node: 'k8s-control-plane-01',
        labels: { 'k8s-app': 'kube-dns' },
        image: 'registry.k8s.io/coredns/coredns:v1.11.1',
        deployment: 'coredns',
      },
      {
        name: 'etcd-k8s-control-plane-01',
        namespace: 'kube-system',
        ready: '1/1',
        status: 'Running',
        restarts: 0,
        age: '12d',
        ip: '192.168.1.10',
        node: 'k8s-control-plane-01',
        labels: { component: 'etcd', tier: 'control-plane' },
        image: 'registry.k8s.io/etcd:3.5.12-0',
      },
      {
        name: 'kube-apiserver-k8s-control-plane-01',
        namespace: 'kube-system',
        ready: '1/1',
        status: 'Running',
        restarts: 0,
        age: '12d',
        ip: '192.168.1.10',
        node: 'k8s-control-plane-01',
        labels: { component: 'kube-apiserver', tier: 'control-plane' },
        image: 'registry.k8s.io/kube-apiserver:v1.30.2',
      },
      {
        name: 'kube-proxy-57xk8',
        namespace: 'kube-system',
        ready: '1/1',
        status: 'Running',
        restarts: 0,
        age: '12d',
        ip: '192.168.1.21',
        node: 'k8s-worker-node-01',
        labels: { 'k8s-app': 'kube-proxy' },
        image: 'registry.k8s.io/kube-proxy:v1.30.2',
      },
    ];

    this.services = [
      {
        name: 'kubernetes',
        namespace: 'default',
        type: 'ClusterIP',
        clusterIP: '10.96.0.1',
        externalIP: '<none>',
        ports: '443/TCP',
        age: '12d',
        selector: '<none>',
      },
      {
        name: 'frontend-svc',
        namespace: 'default',
        type: 'NodePort',
        clusterIP: '10.96.140.23',
        externalIP: '<none>',
        ports: '80:30080/TCP',
        age: '3d4h',
        selector: 'app=frontend',
      },
      {
        name: 'api-gateway-svc',
        namespace: 'default',
        type: 'ClusterIP',
        clusterIP: '10.96.210.45',
        externalIP: '<none>',
        ports: '8080/TCP',
        age: '3d4h',
        selector: 'app=api-gateway',
      },
      {
        name: 'auth-service-svc',
        namespace: 'default',
        type: 'ClusterIP',
        clusterIP: '10.96.165.77',
        externalIP: '<none>',
        ports: '5000/TCP',
        age: '2d18h',
        selector: 'app=auth-service',
      },
      {
        name: 'redis-svc',
        namespace: 'default',
        type: 'ClusterIP',
        clusterIP: '10.96.180.12',
        externalIP: '<none>',
        ports: '6379/TCP',
        age: '12d',
        selector: 'app=redis',
      },
      {
        name: 'postgres-svc',
        namespace: 'default',
        type: 'ClusterIP',
        clusterIP: '10.96.195.88',
        externalIP: '<none>',
        ports: '5432/TCP',
        age: '12d',
        selector: 'app=postgres',
      },
      {
        name: 'kube-dns',
        namespace: 'kube-system',
        type: 'ClusterIP',
        clusterIP: '10.96.0.10',
        externalIP: '<none>',
        ports: '53/UDP,53/TCP,9153/TCP',
        age: '12d',
        selector: 'k8s-app=kube-dns',
      },
    ];

    this.configMaps = [
      {
        name: 'kube-root-ca.crt',
        namespace: 'default',
        dataCount: 1,
        age: '12d',
        data: { 'ca.crt': '-----BEGIN CERTIFICATE-----\nMIIC5zCCAc+gAwIBAgIBADANBgkqhkiG9w0BAQsFADAVMRMwEQYDVQQDEwprdWJl\n...[TRUNCATED]...\n-----END CERTIFICATE-----' },
      },
      {
        name: 'app-config',
        namespace: 'default',
        dataCount: 4,
        age: '3d',
        data: {
          ENVIRONMENT: 'production',
          LOG_LEVEL: 'info',
          PORT: '8080',
          MAX_CONNECTIONS: '100',
        },
      },
      {
        name: 'nginx-proxy-conf',
        namespace: 'default',
        dataCount: 1,
        age: '3d',
        data: {
          'nginx.conf': 'server { listen 80; location / { proxy_pass http://api-gateway:8080; } }',
        },
      },
    ];

    this.ingresses = [
      {
        name: 'main-ingress',
        namespace: 'default',
        hosts: 'app.cloudops.internal,api.cloudops.internal',
        address: '192.168.1.21,192.168.1.22',
        ports: '80, 443',
        age: '3d4h',
      },
    ];
  }

  // Execute kubectl command
  executeKubectl(args: string[], vfs: VirtualFileSystem): CommandOutput {
    if (args.length === 0 || args[0] === '--help' || args[0] === '-h') {
      return {
        stdout: `kubectl controls the Kubernetes cluster manager.

Find more information at: https://kubernetes.io/docs/reference/kubectl/

Basic Commands (Beginner):
  create        Create a resource from a file or from stdin
  run           Run a particular image on the cluster
  set           Set specific features on objects

Basic Commands (Intermediate):
  explain       Get documentation for a resource
  get           Display one or many resources
  edit          Edit a resource on the server
  delete        Delete resources by file names, stdin, resources and names

Deploy Commands:
  rollout       Manage the rollout of a resource
  scale         Set a new size for a deployment, replica set, or replication controller
  autoscale     Auto-scale a deployment, replica set, stateful set, or replication controller

Cluster Management Commands:
  cluster-info  Display cluster information
  top           Display resource (CPU/memory) usage

Troubleshooting and Debugging Commands:
  describe      Show details of a specific resource or group of resources
  logs          Print the logs for a container in a pod
  attach        Attach to a running container
  exec          Execute a command in a container
  port-forward  Forward one or more local ports to a pod

Advanced Commands:
  apply         Apply a configuration to a resource by file name or stdin
  diff          Diff live configuration against would-be applied version

Settings Commands:
  config        Modify kubeconfig files
  version       Print the client and server version information

Usage:
  kubectl [flags] [options]

Use "kubectl <command> --help" for more information about a given command.
`,
        stderr: '',
        exitCode: 0,
      };
    }

    const subCmd = args[0].toLowerCase();
    const remainingArgs = args.slice(1);

    // Extract namespace if passed via -n or --namespace
    let targetNs = this.currentNamespace;
    let allNamespaces = false;
    const filteredArgs: string[] = [];

    for (let i = 0; i < remainingArgs.length; i++) {
      const a = remainingArgs[i];
      if (a === '-n' || a === '--namespace') {
        if (i + 1 < remainingArgs.length) {
          targetNs = remainingArgs[i + 1];
          i++;
        }
      } else if (a === '-A' || a === '--all-namespaces') {
        allNamespaces = true;
      } else {
        filteredArgs.push(a);
      }
    }

    switch (subCmd) {
      case 'version':
        return this.handleVersion(filteredArgs);

      case 'cluster-info':
        return this.handleClusterInfo();

      case 'get':
        return this.handleGet(filteredArgs, targetNs, allNamespaces);

      case 'describe':
        return this.handleDescribe(filteredArgs, targetNs);

      case 'logs':
        return this.handleLogs(filteredArgs, targetNs);

      case 'scale':
        return this.handleScale(filteredArgs, targetNs);

      case 'create':
        return this.handleCreate(filteredArgs, targetNs);

      case 'delete':
        return this.handleDelete(filteredArgs, targetNs);

      case 'apply':
        return this.handleApply(filteredArgs, vfs, targetNs);

      case 'rollout':
        return this.handleRollout(filteredArgs, targetNs);

      case 'top':
        return this.handleTop(filteredArgs, targetNs);

      case 'exec':
        return this.handleExec(filteredArgs, targetNs);

      case 'config':
        return this.handleConfig(filteredArgs);

      default:
        return {
          stdout: '',
          stderr: `error: unknown command "${subCmd}" for "kubectl"\nRun 'kubectl --help' for usage.\n`,
          exitCode: 1,
        };
    }
  }

  private handleVersion(args: string[]): CommandOutput {
    return {
      stdout: `Client Version: v1.30.2
Kustomize Version: v5.0.4-0.20230601165947-6ce0bd390ce3
Server Version: v1.30.2
Cluster: ${this.clusterName} (3 nodes online, containerd 1.7.13)
`,
      stderr: '',
      exitCode: 0,
    };
  }

  private handleClusterInfo(): CommandOutput {
    return {
      stdout: `\x1b[1;32mKubernetes control plane\x1b[0m is running at \x1b[1;34mhttps://192.168.1.10:6443\x1b[0m
\x1b[1;32mCoreDNS\x1b[0m is running at \x1b[1;34mhttps://192.168.1.10:6443/api/v1/namespaces/kube-system/services/kube-dns:dns/proxy\x1b[0m

To further debug and diagnose cluster problems, use 'kubectl cluster-info dump'.
`,
      stderr: '',
      exitCode: 0,
    };
  }

  private handleGet(args: string[], ns: string, allNs: boolean): CommandOutput {
    if (args.length === 0) {
      return {
        stdout: '',
        stderr: 'error: You must specify the type of resource to get. Use "kubectl api-resources" for a complete list of supported resources.\n',
        exitCode: 1,
      };
    }

    const resourceType = args[0].toLowerCase();
    const isWide = args.includes('-o') && (args.includes('wide') || args[args.indexOf('-o') + 1] === 'wide');
    const specificName = args[1] && !args[1].startsWith('-') ? args[1] : undefined;

    // Nodes
    if (['node', 'nodes', 'no'].includes(resourceType)) {
      if (isWide) {
        let out = 'NAME                   STATUS   ROLES           AGE   VERSION   INTERNAL-IP    OS-IMAGE          KERNEL-VERSION      CONTAINER-RUNTIME\n';
        for (const n of this.nodes) {
          out += `${n.name.padEnd(22)} ${n.status.padEnd(8)} ${n.roles.padEnd(15)} ${n.age.padEnd(5)} ${n.version.padEnd(9)} ${n.internalIP.padEnd(14)} ${n.osImage.padEnd(17)} ${n.kernelVersion.padEnd(19)} ${n.containerRuntime}\n`;
        }
        return { stdout: out, stderr: '', exitCode: 0 };
      }
      let out = 'NAME                   STATUS   ROLES           AGE   VERSION\n';
      for (const n of this.nodes) {
        out += `${n.name.padEnd(22)} ${n.status.padEnd(8)} ${n.roles.padEnd(15)} ${n.age.padEnd(5)} ${n.version}\n`;
      }
      return { stdout: out, stderr: '', exitCode: 0 };
    }

    // Pods
    if (['pod', 'pods', 'po'].includes(resourceType)) {
      let list = this.pods;
      if (!allNs) {
        list = list.filter((p) => p.namespace === ns);
      }
      if (specificName) {
        list = list.filter((p) => p.name === specificName);
        if (list.length === 0) {
          return {
            stdout: '',
            stderr: `Error from server (NotFound): pods "${specificName}" not found\n`,
            exitCode: 1,
          };
        }
      }

      if (list.length === 0) {
        return {
          stdout: `No resources found in ${ns} namespace.\n`,
          stderr: '',
          exitCode: 0,
        };
      }

      if (allNs) {
        if (isWide) {
          let out = 'NAMESPACE     NAME                            READY   STATUS    RESTARTS   AGE    IP            NODE                  NOMINATED NODE   READINESS GATES\n';
          for (const p of list) {
            out += `${p.namespace.padEnd(13)} ${p.name.padEnd(31)} ${p.ready.padEnd(7)} ${p.status.padEnd(9)} ${p.restarts.toString().padEnd(10)} ${p.age.padEnd(6)} ${p.ip.padEnd(13)} ${p.node.padEnd(21)} <none>           <none>\n`;
          }
          return { stdout: out, stderr: '', exitCode: 0 };
        }
        let out = 'NAMESPACE     NAME                            READY   STATUS    RESTARTS   AGE\n';
        for (const p of list) {
          out += `${p.namespace.padEnd(13)} ${p.name.padEnd(31)} ${p.ready.padEnd(7)} ${p.status.padEnd(9)} ${p.restarts.toString().padEnd(10)} ${p.age}\n`;
        }
        return { stdout: out, stderr: '', exitCode: 0 };
      }

      if (isWide) {
        let out = 'NAME                            READY   STATUS    RESTARTS   AGE    IP            NODE                  NOMINATED NODE   READINESS GATES\n';
        for (const p of list) {
          out += `${p.name.padEnd(31)} ${p.ready.padEnd(7)} ${p.status.padEnd(9)} ${p.restarts.toString().padEnd(10)} ${p.age.padEnd(6)} ${p.ip.padEnd(13)} ${p.node.padEnd(21)} <none>           <none>\n`;
        }
        return { stdout: out, stderr: '', exitCode: 0 };
      }

      let out = 'NAME                            READY   STATUS    RESTARTS   AGE\n';
      for (const p of list) {
        out += `${p.name.padEnd(31)} ${p.ready.padEnd(7)} ${p.status.padEnd(9)} ${p.restarts.toString().padEnd(10)} ${p.age}\n`;
      }
      return { stdout: out, stderr: '', exitCode: 0 };
    }

    // Deployments
    if (['deployment', 'deployments', 'deploy'].includes(resourceType)) {
      let list = this.deployments;
      if (!allNs) {
        list = list.filter((d) => d.namespace === ns);
      }
      if (specificName) {
        list = list.filter((d) => d.name === specificName);
        if (list.length === 0) {
          return {
            stdout: '',
            stderr: `Error from server (NotFound): deployments.apps "${specificName}" not found\n`,
            exitCode: 1,
          };
        }
      }

      if (list.length === 0) {
        return {
          stdout: `No resources found in ${ns} namespace.\n`,
          stderr: '',
          exitCode: 0,
        };
      }

      if (allNs) {
        let out = 'NAMESPACE     NAME          READY   UP-TO-DATE   AVAILABLE   AGE\n';
        for (const d of list) {
          out += `${d.namespace.padEnd(13)} ${d.name.padEnd(13)} ${d.ready.padEnd(7)} ${d.upToDate.toString().padEnd(12)} ${d.available.toString().padEnd(11)} ${d.age}\n`;
        }
        return { stdout: out, stderr: '', exitCode: 0 };
      }

      let out = 'NAME          READY   UP-TO-DATE   AVAILABLE   AGE\n';
      for (const d of list) {
        out += `${d.name.padEnd(13)} ${d.ready.padEnd(7)} ${d.upToDate.toString().padEnd(12)} ${d.available.toString().padEnd(11)} ${d.age}\n`;
      }
      return { stdout: out, stderr: '', exitCode: 0 };
    }

    // Services
    if (['service', 'services', 'svc'].includes(resourceType)) {
      let list = this.services;
      if (!allNs) {
        list = list.filter((s) => s.namespace === ns);
      }
      if (specificName) {
        list = list.filter((s) => s.name === specificName);
        if (list.length === 0) {
          return {
            stdout: '',
            stderr: `Error from server (NotFound): services "${specificName}" not found\n`,
            exitCode: 1,
          };
        }
      }

      if (list.length === 0) {
        return {
          stdout: `No resources found in ${ns} namespace.\n`,
          stderr: '',
          exitCode: 0,
        };
      }

      if (allNs) {
        let out = 'NAMESPACE     NAME               TYPE        CLUSTER-IP      EXTERNAL-IP   PORT(S)                  AGE\n';
        for (const s of list) {
          out += `${s.namespace.padEnd(13)} ${s.name.padEnd(18)} ${s.type.padEnd(11)} ${s.clusterIP.padEnd(15)} ${s.externalIP.padEnd(13)} ${s.ports.padEnd(24)} ${s.age}\n`;
        }
        return { stdout: out, stderr: '', exitCode: 0 };
      }

      let out = 'NAME               TYPE        CLUSTER-IP      EXTERNAL-IP   PORT(S)                  AGE\n';
      for (const s of list) {
        out += `${s.name.padEnd(18)} ${s.type.padEnd(11)} ${s.clusterIP.padEnd(15)} ${s.externalIP.padEnd(13)} ${s.ports.padEnd(24)} ${s.age}\n`;
      }
      return { stdout: out, stderr: '', exitCode: 0 };
    }

    // Namespaces
    if (['namespace', 'namespaces', 'ns'].includes(resourceType)) {
      const nsList = [
        { name: 'default', status: 'Active', age: '12d' },
        { name: 'kube-node-lease', status: 'Active', age: '12d' },
        { name: 'kube-public', status: 'Active', age: '12d' },
        { name: 'kube-system', status: 'Active', age: '12d' },
        { name: 'ingress-nginx', status: 'Active', age: '12d' },
        { name: 'monitoring', status: 'Active', age: '5d' },
      ];
      let out = 'NAME              STATUS   AGE\n';
      for (const item of nsList) {
        out += `${item.name.padEnd(17)} ${item.status.padEnd(8)} ${item.age}\n`;
      }
      return { stdout: out, stderr: '', exitCode: 0 };
    }

    // ConfigMaps
    if (['configmap', 'configmaps', 'cm'].includes(resourceType)) {
      let list = this.configMaps.filter((c) => c.namespace === ns);
      let out = 'NAME               DATA   AGE\n';
      for (const c of list) {
        out += `${c.name.padEnd(18)} ${c.dataCount.toString().padEnd(6)} ${c.age}\n`;
      }
      return { stdout: out, stderr: '', exitCode: 0 };
    }

    // Ingress
    if (['ingress', 'ingresses', 'ing'].includes(resourceType)) {
      let list = this.ingresses.filter((i) => i.namespace === ns);
      let out = 'NAME           CLASS    HOSTS                                              ADDRESS                         PORTS     AGE\n';
      for (const i of list) {
        out += `${i.name.padEnd(14)} nginx    ${i.hosts.padEnd(50)} ${i.address.padEnd(31)} ${i.ports.padEnd(9)} ${i.age}\n`;
      }
      return { stdout: out, stderr: '', exitCode: 0 };
    }

    // All resources in namespace
    if (resourceType === 'all') {
      const podsOut = this.handleGet(['pods'], ns, false).stdout;
      const svcOut = this.handleGet(['svc'], ns, false).stdout;
      const deployOut = this.handleGet(['deploy'], ns, false).stdout;

      return {
        stdout: `${podsOut}\n${svcOut}\n${deployOut}`,
        stderr: '',
        exitCode: 0,
      };
    }

    return {
      stdout: '',
      stderr: `error: the server doesn't have a resource type "${resourceType}"\n`,
      exitCode: 1,
    };
  }

  private handleDescribe(args: string[], ns: string): CommandOutput {
    if (args.length === 0) {
      return {
        stdout: '',
        stderr: 'error: You must specify the type of resource to describe.\n',
        exitCode: 1,
      };
    }

    const type = args[0].toLowerCase();
    const name = args[1];

    if (!name) {
      return {
        stdout: '',
        stderr: `error: You must specify a resource name to describe, e.g. "kubectl describe ${type} <name>"\n`,
        exitCode: 1,
      };
    }

    if (['pod', 'pods', 'po'].includes(type)) {
      const pod = this.pods.find((p) => p.name === name || p.name.startsWith(name));
      if (!pod) {
        return {
          stdout: '',
          stderr: `Error from server (NotFound): pods "${name}" not found in namespace "${ns}"\n`,
          exitCode: 1,
        };
      }

      return {
        stdout: `Name:             ${pod.name}
Namespace:        ${pod.namespace}
Priority:         0
Service Account:  default
Node:             ${pod.node}/${pod.node === 'k8s-worker-node-01' ? '192.168.1.21' : '192.168.1.22'}
Start Time:       Mon, 06 Jun 2026 10:14:02 +0000
Labels:           ${Object.entries(pod.labels).map(([k, v]) => `${k}=${v}`).join('\n                  ')}
Status:           ${pod.status}
IP:               ${pod.ip}
Controlled By:    ReplicaSet/${pod.deployment ? `${pod.deployment}-75466bc679` : 'none'}
Containers:
  app-container:
    Container ID:   containerd://b489a2f7c010d9e81b93f0a1c2d3e4f5
    Image:          ${pod.image}
    Image ID:       docker.io/library/${pod.image}@sha256:7f012b3c4d5e
    Port:           80/TCP
    Host Port:      0/TCP
    State:          Running
      Started:      Mon, 06 Jun 2026 10:14:04 +0000
    Ready:          True
    Restart Count:  ${pod.restarts}
    Limits:
      cpu:          500m
      memory:       256Mi
    Requests:
      cpu:          100m
      memory:       128Mi
Conditions:
  Type                        Status
  PodReadyToStartContainers   True
  Initialized                 True
  Ready                       True
  ContainersReady             True
  PodScheduled                True
Events:
  Type    Reason     Age    From               Message
  ----    ------     ----   ----               -------
  Normal  Scheduled  3d4h   default-scheduler  Successfully assigned ${pod.namespace}/${pod.name} to ${pod.node}
  Normal  Pulled     3d4h   kubelet            Container image "${pod.image}" already present on machine
  Normal  Created    3d4h   kubelet            Created container app-container
  Normal  Started    3d4h   kubelet            Started container app-container
`,
        stderr: '',
        exitCode: 0,
      };
    }

    if (['node', 'nodes', 'no'].includes(type)) {
      const node = this.nodes.find((n) => n.name === name);
      if (!node) {
        return {
          stdout: '',
          stderr: `Error from server (NotFound): nodes "${name}" not found\n`,
          exitCode: 1,
        };
      }

      return {
        stdout: `Name:               ${node.name}
Roles:              ${node.roles}
Labels:             beta.kubernetes.io/arch=amd64
                    beta.kubernetes.io/os=linux
                    kubernetes.io/hostname=${node.name}
                    node.kubernetes.io/instance-type=cloud.standard.4
Annotations:        kubeadm.alpha.kubernetes.io/cri-socket: unix:///run/containerd/containerd.sock
                    node.alpha.kubernetes.io/ttl: 0
CreationTimestamp:  Sat, 28 May 2026 08:00:00 +0000
Conditions:
  Type                 Status  LastHeartbeatTime                 Reason                       Message
  ----                 ------  -----------------                 ------                       -------
  NetworkUnavailable   False   Sat, 28 May 2026 08:00:15 +0000   CalicoIsUp                   Calico is providing networking
  MemoryPressure       False   Mon, 09 Jun 2026 12:00:00 +0000   KubeletHasSufficientMemory   kubelet has sufficient memory available
  DiskPressure         False   Mon, 09 Jun 2026 12:00:00 +0000   KubeletHasNoDiskPressure     kubelet has no disk pressure
  PIDPressure          False   Mon, 09 Jun 2026 12:00:00 +0000   KubeletHasSufficientPID      kubelet has sufficient PID available
  Ready                True    Mon, 09 Jun 2026 12:00:00 +0000   KubeletReady                 kubelet is posting ready status
Addresses:
  InternalIP:   ${node.internalIP}
  Hostname:     ${node.name}
Capacity:
  cpu:                ${node.cpu}
  ephemeral-storage:  102837248Ki
  memory:             ${node.memory}
  pods:               110
Allocatable:
  cpu:                ${parseInt(node.cpu) - 0.2}
  memory:             ${node.memory}
  pods:               110
System Info:
  Machine ID:                 e87b92f741d24a9eb482a0b1c
  System UUID:                54f76231-18cb-4720-bc2f-6819a82bb192
  Boot ID:                    b901fc21-9964-42b7-8ce2-4752bca19182
  Kernel Version:             ${node.kernelVersion}
  OS Image:                   ${node.osImage}
  Operating System:           linux
  Architecture:               amd64
  Container Runtime Version:  ${node.containerRuntime}
  Kubelet Version:            ${node.version}
  Kube-Proxy Version:         ${node.version}
Events:                       <none>
`,
        stderr: '',
        exitCode: 0,
      };
    }

    return {
      stdout: `Name:         ${name}\nNamespace:    ${ns}\nStatus:       Active\n`,
      stderr: '',
      exitCode: 0,
    };
  }

  private handleLogs(args: string[], ns: string): CommandOutput {
    if (args.length === 0) {
      return {
        stdout: '',
        stderr: 'error: Pod name is required for logs\n',
        exitCode: 1,
      };
    }

    const podName = args.find((a) => !a.startsWith('-')) || '';
    const pod = this.pods.find((p) => p.name === podName || p.name.startsWith(podName));

    if (!pod) {
      return {
        stdout: '',
        stderr: `Error from server (NotFound): pods "${podName}" not found in namespace "${ns}"\n`,
        exitCode: 1,
      };
    }

    if (pod.name.startsWith('frontend')) {
      return {
        stdout: `192.168.1.1 - - [09/Jun/2026:07:12:30 +0000] "GET / HTTP/1.1" 200 615 "-" "Mozilla/5.0 Chrome/125.0"
192.168.1.1 - - [09/Jun/2026:07:12:31 +0000] "GET /static/bundle.js HTTP/1.1" 200 124803 "http://app.cloudops.internal/" "Mozilla/5.0"
192.168.1.1 - - [09/Jun/2026:07:12:32 +0000] "GET /api/v1/health HTTP/1.1" 200 42 "-" "Go-http-client/1.1"
192.168.1.25 - - [09/Jun/2026:07:14:01 +0000] "GET /healthz HTTP/1.1" 200 2 "-" "kube-probe/1.30"
192.168.1.25 - - [09/Jun/2026:07:14:15 +0000] "GET /ready HTTP/1.1" 200 2 "-" "kube-probe/1.30"
[notice] 1#1: using the "epoll" event method
[notice] 1#1: nginx/1.27.0
[notice] 1#1: built by gcc 13.2.1 20231014 (Alpine 13.2.1_20231014)
[notice] 1#1: OS: Linux 6.8.0-40-generic
[notice] 1#1: start worker processes
[notice] 1#1: start worker process 29
[notice] 1#1: start worker process 30
`,
        stderr: '',
        exitCode: 0,
      };
    }

    if (pod.name.startsWith('api-gateway')) {
      return {
        stdout: `{"level":"info","time":"2026-06-09T07:10:00.120Z","msg":"Fastify HTTP server listening on 0.0.0.0:8080"}
{"level":"info","time":"2026-06-09T07:10:05.412Z","msg":"Connected to Redis cache at 10.96.180.12:6379"}
{"level":"info","time":"2026-06-09T07:10:06.189Z","msg":"Connected to PostgreSQL pool at 10.96.195.88:5432"}
{"level":"info","time":"2026-06-09T07:12:32.001Z","reqId":"req-1","method":"GET","url":"/api/v1/health","status":200,"responseTime":1.42}
{"level":"info","time":"2026-06-09T07:12:45.881Z","reqId":"req-2","method":"POST","url":"/api/v1/auth/login","status":200,"responseTime":24.18}
{"level":"info","time":"2026-06-09T07:13:02.103Z","reqId":"req-3","method":"GET","url":"/api/v1/metrics","status":200,"responseTime":3.05}
`,
        stderr: '',
        exitCode: 0,
      };
    }

    return {
      stdout: `[2026-06-09 07:00:01] Service initialized successfully on port 80.
[2026-06-09 07:00:02] Database connection pool established.
[2026-06-09 07:15:00] Periodic garbage collection ran, 0 errors.
[2026-06-09 07:20:00] Service health: OK (uptime: 72h)
`,
      stderr: '',
      exitCode: 0,
    };
  }

  private handleScale(args: string[], ns: string): CommandOutput {
    // e.g. kubectl scale deployment frontend --replicas=4
    let target = '';
    let replicas = -1;

    for (const a of args) {
      if (a.startsWith('--replicas=')) {
        replicas = parseInt(a.split('=')[1], 10);
      } else if (!a.startsWith('-')) {
        target = a;
      }
    }

    if (replicas < 0) {
      return {
        stdout: '',
        stderr: 'error: --replicas must be a non-negative integer\n',
        exitCode: 1,
      };
    }

    const deployName = target.replace(/^deployment\//i, '').replace(/^deploy\//i, '');
    const deploy = this.deployments.find((d) => d.name === deployName && d.namespace === ns);

    if (!deploy) {
      return {
        stdout: '',
        stderr: `Error from server (NotFound): deployments.apps "${deployName}" not found\n`,
        exitCode: 1,
      };
    }

    deploy.desired = replicas;
    deploy.ready = `${replicas}/${replicas}`;
    deploy.available = replicas;
    deploy.upToDate = replicas;

    // Adjust pods in list
    const currentPods = this.pods.filter((p) => p.deployment === deployName);
    if (replicas > currentPods.length) {
      // Add pods
      for (let i = currentPods.length; i < replicas; i++) {
        const randId = Math.random().toString(36).substring(2, 7);
        const node = i % 2 === 0 ? 'k8s-worker-node-01' : 'k8s-worker-node-02';
        this.pods.push({
          name: `${deployName}-75466bc679-${randId}`,
          namespace: ns,
          ready: '1/1',
          status: 'Running',
          restarts: 0,
          age: '10s',
          ip: `10.244.${(i % 2) + 1}.${30 + i}`,
          node,
          labels: { app: deployName, podTemplateHash: '75466bc679' },
          image: deploy.image,
          deployment: deployName,
        });
      }
    } else if (replicas < currentPods.length) {
      // Remove excess pods
      const toRemove = currentPods.slice(replicas);
      this.pods = this.pods.filter((p) => !toRemove.includes(p));
    }

    return {
      stdout: `deployment.apps/${deployName} scaled\n`,
      stderr: '',
      exitCode: 0,
    };
  }

  private handleCreate(args: string[], ns: string): CommandOutput {
    if (args.length === 0) {
      return {
        stdout: '',
        stderr: 'error: must specify one of: deployment, namespace, secret, configmap, service\n',
        exitCode: 1,
      };
    }

    const resType = args[0].toLowerCase();
    const name = args[1];

    if (!name) {
      return {
        stdout: '',
        stderr: `error: NAME is required for "kubectl create ${resType}"\n`,
        exitCode: 1,
      };
    }

    if (['deployment', 'deploy'].includes(resType)) {
      let image = 'nginx:alpine';
      for (const a of args) {
        if (a.startsWith('--image=')) {
          image = a.split('=')[1];
        }
      }

      this.deployments.push({
        name,
        namespace: ns,
        ready: '1/1',
        upToDate: 1,
        available: 1,
        desired: 1,
        age: '5s',
        image,
        port: 80,
        selector: `app=${name}`,
      });

      const randHash = Math.random().toString(36).substring(2, 7);
      this.pods.push({
        name: `${name}-55b79c8d-${randHash}`,
        namespace: ns,
        ready: '1/1',
        status: 'Running',
        restarts: 0,
        age: '5s',
        ip: '10.244.1.44',
        node: 'k8s-worker-node-01',
        labels: { app: name },
        image,
        deployment: name,
      });

      return {
        stdout: `deployment.apps/${name} created\n`,
        stderr: '',
        exitCode: 0,
      };
    }

    if (['namespace', 'ns'].includes(resType)) {
      return {
        stdout: `namespace/${name} created\n`,
        stderr: '',
        exitCode: 0,
      };
    }

    return {
      stdout: `${resType}/${name} created\n`,
      stderr: '',
      exitCode: 0,
    };
  }

  private handleDelete(args: string[], ns: string): CommandOutput {
    if (args.length === 0) {
      return {
        stdout: '',
        stderr: 'error: resource type and name required for delete\n',
        exitCode: 1,
      };
    }

    const type = args[0].toLowerCase();
    const name = args[1];

    if (!name) {
      return {
        stdout: '',
        stderr: `error: name required for "kubectl delete ${type} <name>"\n`,
        exitCode: 1,
      };
    }

    if (['pod', 'pods', 'po'].includes(type)) {
      const idx = this.pods.findIndex((p) => p.name === name);
      if (idx === -1) {
        return {
          stdout: '',
          stderr: `Error from server (NotFound): pods "${name}" not found\n`,
          exitCode: 1,
        };
      }
      const removed = this.pods.splice(idx, 1)[0];
      // If deployment exists, respawn new pod
      if (removed.deployment) {
        const randId = Math.random().toString(36).substring(2, 7);
        setTimeout(() => {
          this.pods.push({
            name: `${removed.deployment}-75466bc679-${randId}`,
            namespace: ns,
            ready: '1/1',
            status: 'Running',
            restarts: 0,
            age: '1s',
            ip: '10.244.1.99',
            node: removed.node,
            labels: removed.labels,
            image: removed.image,
            deployment: removed.deployment,
          });
        }, 100);
      }
      return {
        stdout: `pod "${name}" deleted\n`,
        stderr: '',
        exitCode: 0,
      };
    }

    if (['deployment', 'deployments', 'deploy'].includes(type)) {
      const idx = this.deployments.findIndex((d) => d.name === name);
      if (idx === -1) {
        return {
          stdout: '',
          stderr: `Error from server (NotFound): deployments.apps "${name}" not found\n`,
          exitCode: 1,
        };
      }
      this.deployments.splice(idx, 1);
      this.pods = this.pods.filter((p) => p.deployment !== name);
      return {
        stdout: `deployment.apps "${name}" deleted\n`,
        stderr: '',
        exitCode: 0,
      };
    }

    return {
      stdout: `${type} "${name}" deleted\n`,
      stderr: '',
      exitCode: 0,
    };
  }

  private handleApply(args: string[], vfs: VirtualFileSystem, ns: string): CommandOutput {
    // kubectl apply -f <filename>
    const fileIdx = args.indexOf('-f');
    if (fileIdx === -1 || fileIdx + 1 >= args.length) {
      return {
        stdout: '',
        stderr: 'error: You must specify resources via -f or -k.\n',
        exitCode: 1,
      };
    }

    const filepath = args[fileIdx + 1];
    const node = vfs.resolvePathNode(filepath);

    if (!node || node.type !== 'file' || !node.content) {
      return {
        stdout: '',
        stderr: `error: the path "${filepath}" does not exist\n`,
        exitCode: 1,
      };
    }

    // Parse simple kind and metadata from yaml content
    const content = node.content;
    const kindMatch = content.match(/kind:\s*([A-Za-z0-9]+)/i);
    const nameMatch = content.match(/name:\s*([A-Za-z0-9-_]+)/i);

    const kind = kindMatch ? kindMatch[1] : 'Resource';
    const name = nameMatch ? nameMatch[1] : 'custom-resource';

    if (kind.toLowerCase() === 'deployment') {
      const existing = this.deployments.find((d) => d.name === name);
      if (existing) {
        return {
          stdout: `deployment.apps/${name} configured\n`,
          stderr: '',
          exitCode: 0,
        };
      }
      this.deployments.push({
        name,
        namespace: ns,
        ready: '1/1',
        upToDate: 1,
        available: 1,
        desired: 1,
        age: '1s',
        image: 'nginx:1.27',
        port: 80,
        selector: `app=${name}`,
      });
      return {
        stdout: `deployment.apps/${name} created\n`,
        stderr: '',
        exitCode: 0,
      };
    }

    if (kind.toLowerCase() === 'service') {
      return {
        stdout: `service/${name} configured\n`,
        stderr: '',
        exitCode: 0,
      };
    }

    return {
      stdout: `${kind.toLowerCase()}.apps/${name} configured\n`,
      stderr: '',
      exitCode: 0,
    };
  }

  private handleRollout(args: string[], ns: string): CommandOutput {
    if (args.length === 0) {
      return {
        stdout: '',
        stderr: 'error: must specify one of: history, pause, restart, resume, status, undo\n',
        exitCode: 1,
      };
    }

    const action = args[0].toLowerCase();
    const target = args[1] || 'deployment/frontend';

    if (action === 'status') {
      return {
        stdout: `Waiting for ${target} rollout to finish: 2 of 2 updated replicas are available...\n${target} successfully rolled out\n`,
        stderr: '',
        exitCode: 0,
      };
    }

    if (action === 'restart') {
      return {
        stdout: `${target} restarted\n`,
        stderr: '',
        exitCode: 0,
      };
    }

    return {
      stdout: `${target} rollout updated\n`,
      stderr: '',
      exitCode: 0,
    };
  }

  private handleTop(args: string[], ns: string): CommandOutput {
    if (args.length === 0) {
      return {
        stdout: '',
        stderr: 'error: must specify either "node" or "pod"\n',
        exitCode: 1,
      };
    }

    const type = args[0].toLowerCase();
    if (['node', 'nodes'].includes(type)) {
      return {
        stdout: `NAME                   CPU(cores)   CPU%   MEMORY(bytes)   MEMORY%
k8s-control-plane-01   280m         7%     1940Mi          24%
k8s-worker-node-01     640m         8%     3810Mi          23%
k8s-worker-node-02     490m         6%     3120Mi          19%
`,
        stderr: '',
        exitCode: 0,
      };
    }

    if (['pod', 'pods'].includes(type)) {
      return {
        stdout: `NAME                            CPU(cores)   MEMORY(bytes)
frontend-75466bc679-2wqk1       12m          28Mi
frontend-75466bc679-8dfl2       14m          30Mi
api-gateway-5f78b84d9f-k2l9p    45m          112Mi
api-gateway-5f78b84d9f-9x7zm    40m          108Mi
auth-service-678dc8bf5b-p90zq   28m          64Mi
redis-master-0                  18m          42Mi
postgres-db-0                   35m          180Mi
`,
        stderr: '',
        exitCode: 0,
      };
    }

    return {
      stdout: '',
      stderr: `error: unknown resource type "${type}" for "kubectl top"\n`,
      exitCode: 1,
    };
  }

  private handleExec(args: string[], ns: string): CommandOutput {
    // kubectl exec -it <pod> -- <cmd>
    const dashDashIdx = args.indexOf('--');
    const commandToExec = dashDashIdx !== -1 ? args.slice(dashDashIdx + 1).join(' ') : 'sh';
    const podName = args.find((a, i) => !a.startsWith('-') && (dashDashIdx === -1 || i < dashDashIdx)) || 'pod';

    return {
      stdout: `[${podName}] $ ${commandToExec}
Linux ${podName} 6.8.0-40-generic x86_64 Linux
Environment: Container runtime containerd 1.7.13
`,
      stderr: '',
      exitCode: 0,
    };
  }

  private handleConfig(args: string[]): CommandOutput {
    const action = args[0] || 'view';
    if (action === 'current-context') {
      return {
        stdout: `kubernetes-admin@${this.clusterName}\n`,
        stderr: '',
        exitCode: 0,
      };
    }
    if (action === 'get-contexts') {
      return {
        stdout: `CURRENT   NAME                                    CLUSTER             AUTHINFO           NAMESPACE
*         kubernetes-admin@${this.clusterName}   ${this.clusterName}   kubernetes-admin   default
          minikube                                minikube            minikube           default
`,
        stderr: '',
        exitCode: 0,
      };
    }
    return {
      stdout: `apiVersion: v1
clusters:
- cluster:
    certificate-authority-data: REDACTED
    server: https://192.168.1.10:6443
  name: ${this.clusterName}
contexts:
- context:
    cluster: ${this.clusterName}
    user: kubernetes-admin
    namespace: default
  name: kubernetes-admin@${this.clusterName}
current-context: kubernetes-admin@${this.clusterName}
kind: Config
preferences: {}
users:
- name: kubernetes-admin
  user:
    client-certificate-data: REDACTED
    client-key-data: REDACTED
`,
      stderr: '',
      exitCode: 0,
    };
  }
}
