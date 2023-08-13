import { Blockchain, SandboxContract } from '@ton-community/sandbox';
import { Builder, Cell, toNano } from 'ton-core';
import { Task3 } from '../wrappers/Task3';
import '@ton-community/test-utils';
import { compile } from '@ton-community/blueprint';
import { strict } from 'assert';

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

    it('10, 11, not found', async () => {

        const b1 = new Builder();
        b1.storeInt(123, 8);
        const data1 = b1.endCell();

        const b2 = new Builder();
        b2.storeInt(123, 8);
        b2.storeRef(data1);
        const data2 = b2.endCell();

        const b3 = new Builder();
        b3.storeInt(124, 8);
        b3.storeRef(data2);
        const data3 = b3.endCell();

        const result = await task3.getResult(10, 11, data3);

        var resultLine = await task3.getBitsLine(result);
        var dataLine = await task3.getBitsLine(data3);
        expect(resultLine).toBe(dataLine);
    });

    it('empty cell', async () => {

        const b = new Builder();
        const data = b.endCell();

        const result = await task3.getResult(10, 11, data);

        var resultLine = await task3.getBitsLine(result);
        var dataLine = await task3.getBitsLine(data);
        expect(resultLine).toBe(dataLine);
    });

    it('12, 15, replace simple', async () => {

        const b1 = new Builder();
        b1.storeInt(123, 8);
        const data1 = b1.endCell();

        const b2 = new Builder();
        b2.storeInt(123, 8);
        b2.storeRef(data1);
        const data2 = b2.endCell();

        const b3 = new Builder();
        b3.storeInt(124, 8);
        b3.storeRef(data2);
        const data3 = b3.endCell();

        const result = await task3.getResult(12, 15, data3);

        var resultLine = await task3.getBitsLine(result);
        var dataLine = await task3.replaceCellAll(data3, "1100", "1111");
        expect(resultLine).toBe(dataLine);
    });

    it('8, 9, replace join', async () => {

        const b1 = new Builder();
        b1.storeInt(123, 8);
        const data1 = b1.endCell();

        const b2 = new Builder();
        b2.storeInt(123, 8);
        b2.storeRef(data1);
        const data2 = b2.endCell();

        const b3 = new Builder();
        b3.storeInt(124, 8);
        b3.storeRef(data2);
        const data3 = b3.endCell();

        const result = await task3.getResult(8, 9, data3);

        var resultLine = await task3.getBitsLine(result);
        var dataLine = await task3.replaceCellAll(data3, "1000", "1001");
        expect(resultLine).toBe(dataLine);
    });

    it('8, 9, big data', async () => 
    {
        var b = new Builder();
        b.storeInt(123, 8);
        var data = b.endCell();

        for (var i = 0; i < 5; i++)
        {
            b = new Builder();
            b.storeInt(i, 16);
            b.storeRef(data);
            data = b.endCell();
        }

        const result = await task3.getResult(8, 9, data);

        var resultLine = await task3.getBitsLine(result);
        var dataLine = await task3.replaceCellAll(data, "1000", "1001");
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

    it('1.0.1.0 -> ', async () => {

        const b0 = new Builder();
        b0.storeUint(1, 1);
        b0.storeUint(0, 1);
        const data0 = b0.endCell();

        const b1 = new Builder();
        b1.storeUint(1, 1);
        b1.storeUint(0, 1);
        b1.storeRef(data0);
        const data1 = b1.endCell();

        const b2 = new Builder();
        b2.storeUint(1, 1);
        b2.storeUint(0, 1);
        b2.storeRef(data1);
        const data2 = b2.endCell();

        const result = await task3.getResult(42, 5, data2);

        var resultLine = await task3.getBitsLine(result);
        var rep = await task3.replaceCellAll(data2, "101010", "101");

        expect(resultLine).toBe(rep);
    });

    it('string replace test', async () => {

        var st = "0000000000000100000000000000001100000000000000100000000000000001000000000000000001111011";
        var rp = "0000000000000100100000000000001100100000000000100100000000000001001000000000000001111011";
        var rep = st.replaceAll("1000", "1001");

        expect(rep).toBe(rp);
    });
});
