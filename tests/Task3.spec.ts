import { Blockchain, SandboxContract } from '@ton-community/sandbox';
import { BitBuilder, BitString, Builder, Cell, toNano } from 'ton-core';
import { Task3 } from '../wrappers/Task3';
import '@ton-community/test-utils';
import { compile } from '@ton-community/blueprint';
import { buffer } from 'stream/consumers';

describe('Task3', () => {
    let code: Cell;

    beforeAll(async () => {
        code = await compile('Task3');
    });

    let blockchain: Blockchain;
    let task3: SandboxContract<Task3>;

    beforeEach(async () => {
        blockchain = await Blockchain.create();

        task3 = blockchain.openContract(Task3.createFromConfig({}, code));

        const deployer = await blockchain.treasury('deployer');

        const deployResult = await task3.sendDeploy(deployer.getSender(), toNano('0.05'));

        expect(deployResult.transactions).toHaveTransaction({
            from: deployer.address,
            to: task3.address,
            deploy: true,
            success: true,
        });
    });

    it('should deploy', async () => {
        // the check is done inside beforeEach
        // blockchain and task3 are ready to use
    });

    it('flag "6" (110) - 2 bit', async () => {
        const encoded = await task3.getBitOfInt(6, 2);
        expect(encoded).toBe(1n);
    });

    it('flag "5" (101) - 2 bit', async () => {
        const encoded = await task3.getBitOfInt(5, 2);
        expect(encoded).toBe(0n);
    });

    it('flag "1" (1) - 1 bit', async () => {
        const encoded = await task3.getBitOfInt(1, 1);
        expect(encoded).toBe(1n);
    });

    it('flag "10" (1010) - 4 bit', async () => {
        const encoded = await task3.getBitOfInt(10, 4);
        expect(encoded).toBe(0n);
    });

    it('flag "11" (1011) - 4 bit', async () => {
        const encoded = await task3.getBitOfInt(11, 4);
        expect(encoded).toBe(1n);
    });

    it('10, 11, empty cell', async () => {
        const linked_list = new Cell();

        const dataBuilder = new Builder();
        dataBuilder.storeBit(1);
        dataBuilder.storeBit(1);
        dataBuilder.storeBit(0);
        dataBuilder.storeBit(1);
        dataBuilder.storeBit(1);
        dataBuilder.storeBit(1);
        dataBuilder.storeBit(1);
        const data = dataBuilder.endCell();

        const result = await task3.getResult(10, 11, linked_list, data);
        var resultLine = await task3.getBitsLine(result);
        var dataLine = await task3.getBitsLine(data);
        expect(resultLine).toBe(dataLine);
    });
});
