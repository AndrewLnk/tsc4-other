import { Blockchain, SandboxContract } from '@ton-community/sandbox';
import { BitBuilder, BitReader, BitString, Builder, Cell, toNano } from 'ton-core';
import { Task3 } from '../wrappers/Task3';
import '@ton-community/test-utils';
import { compile } from '@ton-community/blueprint';
import { strict } from 'assert';
import { randomBytes, randomInt } from 'crypto';

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

    it('empty cell', async () => {

        const b = new Builder();
        const data = b.endCell();

        const result = await task3.getResult(10, 11, data);

        var resultLine = await task3.getBitsLine(result);
        var dataLine = await task3.getBitsLine(data);
        expect(resultLine).toBe(dataLine);
    });

    it('example test', async () => {

        const b1 = new Builder();
        b1.storeUint(1, 1);
        b1.storeUint(0, 1);
        b1.storeUint(1, 1);
        b1.storeUint(0, 1);
        b1.storeUint(1, 1);
        b1.storeUint(0, 1);
        b1.storeUint(0, 1);
        b1.storeUint(0, 1);
        b1.storeUint(1, 1);
        b1.storeUint(1, 1);
        b1.storeUint(1, 1);
        b1.storeUint(1, 1);
        b1.storeUint(1, 1);
        b1.storeUint(1, 1);
        b1.storeUint(1, 1);
        b1.storeUint(1, 1);
        b1.storeUint(1, 1);
        const data1 = b1.endCell();

        const b2 = new Builder();
        b2.storeUint(1, 1);
        b2.storeUint(1, 1);
        b2.storeUint(1, 1);
        b2.storeUint(0, 1);
        b2.storeUint(1, 1);
        b2.storeUint(1, 1);
        b2.storeUint(1, 1);
        b2.storeUint(1, 1);
        b2.storeUint(1, 1);
        b2.storeUint(1, 1);
        b2.storeUint(1, 1);
        b2.storeUint(0, 1);
        b2.storeUint(1, 1);
        b2.storeUint(0, 1);
        b2.storeUint(0, 1);
        b2.storeUint(0, 1);
        b2.storeUint(0, 1);
        b2.storeUint(1, 1);
        b2.storeUint(0, 1);
        b2.storeUint(1, 1);
        b2.storeUint(1, 1);
        b2.storeRef(data1);
        const data2 = b2.endCell();

        const result = await task3.getResult(373, 511, data2);

        var resultLine = await task3.replaceCellAll(data2, "101110101", "111111111");
        var dataLine = await task3.getBitsLine(result);

        expect(dataLine).toBe(resultLine);
    });

    it('5', async () => 
    {
        var b = new Builder();
        b.storeInt(123, 8);
        var data = b.endCell();

        for (var i = 0; i < 5; i++)
        {
            b = new Builder();
            b.storeBuffer(randomBytes(127)); // randomInt(1, 20)
            b.storeRef(data);
            data = b.endCell();
        }

        const result = await task3.getResult(42, 1, data);
        var resultLine = await task3.getBitsLine(result);

        var rep = await task3.replaceCellAll(data, "101010", "1");

        expect(resultLine).toBe(rep);
    });

    it('10', async () => 
    {
        var b = new Builder();
        b.storeInt(123, 8);
        var data = b.endCell();

        for (var i = 0; i < 10; i++)
        {
            b = new Builder();
            b.storeBuffer(randomBytes(127)); // randomInt(1, 20)
            b.storeRef(data);
            data = b.endCell();
        }

        const result = await task3.getResult(42, 1, data);
        var resultLine = await task3.getBitsLine(result);

        var rep = await task3.replaceCellAll(data, "101010", "1");

        expect(resultLine).toBe(rep);
    });
});
