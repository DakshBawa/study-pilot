export const SAMPLE = `# Processes and Threads
A process is a program in execution with its own address space and resources. Threads are lightweight units of execution that share the memory of their parent process. The scheduler decides which process receives the processor next. Context switching saves the state of one process so another can run. A process control block stores the state, registers and priority of each process.

# Memory Management
Paging divides physical memory into fixed-size blocks called frames. Virtual memory lets a program use more memory than is physically installed. A page table maps virtual addresses to physical frames. Thrashing happens when the system spends more time swapping pages than executing instructions. Segmentation divides a program into logical units such as code, stack and heap.

# Deadlocks
A deadlock occurs when processes wait forever for resources held by each other. Mutual exclusion means a resource can be used by only one process at a time. Circular wait is a condition where each process waits for a resource held by the next one. The banker's algorithm avoids deadlock by checking whether a state is safe before granting resources. Preemption breaks deadlock by taking a resource away from a waiting process.
`;
