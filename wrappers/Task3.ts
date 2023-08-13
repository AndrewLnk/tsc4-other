import { Address, beginCell, Cell, Contract, contractAddress, ContractProvider, Sender, SendMode } from 'ton-core';
import { DefaultDeserializer } from 'v8';

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

    async getResult(provider: ContractProvider, flag: number, value: number, root: Cell): Promise<Cell> {
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
        var cell = arr;
        var i = 0;

        while(i < bits.length)
        {
            result += bits.at(i) == true ? 1: 0;
            i += 1;

            if (i == bits.length && cell.refs.length > 0)
            {
                var newCell = cell.refs.at(0);
                if (newCell != null)
                {
                    i = 0;
                    cell = newCell;
                    bits = cell.bits;
                }
            }
        }

        return result;
    }

    async replaceCellAll(arr: Cell, rep: string, n: string): Promise<string> 
    {
        var result = "";
        var bits = arr.bits;
        var cell = arr;
        var i = 0;

        while(i < bits.length)
        {
            result += bits.at(i) == true ? 1: 0;
            i += 1;

            if (i == bits.length && cell.refs.length > 0)
            {
                var newCell = cell.refs.at(0);
                if (newCell != null)
                {
                    i = 0;
                    cell = newCell;
                    bits = cell.bits;
                }
            }
        }

        return result.replaceAll(rep, n);
    }
}
