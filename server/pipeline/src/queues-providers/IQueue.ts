export interface IQueue<T> {
    add(data: T): Promise<void>;
    process(callback: (data: T) => Promise<void>): void;
}
