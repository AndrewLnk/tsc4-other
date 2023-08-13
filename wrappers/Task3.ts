import { Address, beginCell, Cell, Contract, contractAddress, ContractProvider, Sender, SendMode } from 'ton-core';

export type Task3Config = {};

export function task3ConfigToCell(config: Task3Config): Cell {
    return beginCell().endCell();
}

export class Task3 implements Contract {
    constructor(readonly address: Address, readonly init?: { code: Cell; data: Cell }) {}

    static createFromAddress(address: Address) {
        return new Task3(address);
    }

    static createFromConfig(config: Task3Config, code: Cell, workchain = 0) {
        const data = task3ConfigToCell(config);
        const init = { code, data };
        return new Task3(contractAddress(workchain, init), init);
    }

    async sendDeploy(provider: ContractProvider, via: Sender, value: bigint) {
        await provider.internal(via, {
            value,
            sendMode: SendMode.PAY_GAS_SEPARATELY,
            body: beginCell().endCell(),
        });
    }

    async getBitOfInt(provider: ContractProvider, v: number, i: number): Promise<bigint> {
        const {stack} = await provider.get('debug_second_int_bit', 
        [
            {type: 'int', value: BigInt(v)},
            {type: 'int', value: BigInt(i)}    
        ]);
        return BigInt(stack.readNumber());
    }

    async getResult(provider: ContractProvider, flag: number, value: number, root: Cell, expected: Cell): Promise<Cell> {
        const {stack} = await provider.get('find_and_replace', [
            {type: 'int', value: BigInt(flag)},
            {type: 'int', value: BigInt(value)},
            {type: 'cell', cell: root}
        ]);

        return stack.readCell();
    }

    async getBitsLine(provider: ContractProvider, arr: Cell): Promise<string> {
        var result = "";
        var bits = arr.bits;
        for (var i = 0; i < bits.length; i += 1)
        {
            result += bits.at(i) == true ? 1: 0;
        }
        return result;
    }
}
