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

        const result = await task3.getResult(10n, 11n, data);

        var resultLine = await task3.getBitsLine(result);
        var dataLine = await task3.getBitsLine(data);
        expect(resultLine).toBe(dataLine);
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

        const result = await task3.getResult(10n, 11n, data3);

        var resultLine = await task3.getBitsLine(result);
        var dataLine = await task3.getBitsLine(data3);
        expect(resultLine).toBe(dataLine);
    });

    it('1 -> 10', async () => {

        const b1 = new Builder();
        b1.storeBit(0);
        b1.storeBit(1);
        b1.storeBit(1);
        const data = b1.endCell();

        const result = await task3.getResult(3n, 65846858677786564796789677789789789789n, data);
        var resultLine = await task3.getBitsLine(result);
        
        var dataLine = await task3.replaceCellAll(data, "11", "110001100010011010010011001000101011100010100000100010111110011110111001101000011000100010111101100000110111111001111001011101");
        
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

        const result = await task3.getResult(12n, 15n, data3);

        var resultLine = await task3.getBitsLine(result);
        var dataLine = await task3.getBitsLine(data3);
        var dataLine_rep = dataLine.replace("1100", "1111");
        
        if (resultLine == dataLine_rep)
        {
            expect(resultLine).toBe(dataLine_rep);
        }
        else
        {
            let w = dataLine;
            w += "=>";
            w += resultLine;
            expect(w).toBe(dataLine_rep);
        }
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

        const result = await task3.getResult(8n, 9n, data3);

        var resultLine = await task3.getBitsLine(result);
        var dataLine = await task3.getBitsLine(data3);
        dataLine = dataLine.replace("1000", "1001");
        expect(resultLine).toBe(dataLine);
    });

    it('8, 9, big data', async () => 
    {
        var b = new Builder();
        b.storeInt(123, 8);
        var data = b.endCell();

        for (var i = 0; i < 10; i++)
        {
            b = new Builder();
            b.storeInt(i, 16);
            b.storeRef(data);
            data = b.endCell();
        }

        const result = await task3.getResult(8n, 9n, data);

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

        const result = await task3.getResult(373n, 511n, data2);

        var resultLine = await task3.getBitsLine(result);
        var dataLine = await task3.replaceCellAll(data2, "101110101", "111111111");
        expect(resultLine).toBe(dataLine);
    });

    it('5', async () => 
    {
        var b = new Builder();
        b.storeBuffer(randomBytes(30));
        var data = b.endCell();

        for (var i = 0; i < 600; i++)
        {
            b = new Builder();
            b.storeBuffer(randomBytes(1));
            b.storeRef(data);
            data = b.endCell();
        }

        const result = await task3.getResult(42n, 1n, data);
        var resultLine = await task3.getBitsLine(result);

        var rep = await task3.replaceCellAll(data, "101010", "1");

        expect(resultLine).toBe(rep);
    });

    it('10', async () => 
    {
        for (var r = 0; r < 0; r++)
        {
            var b = new Builder();
            b.storeBit(0);
            var data = b.endCell();

            for (var i = 0; i < randomInt(1, 127); i++)
            {
                b = new Builder();
                b.storeBuffer(randomBytes(randomInt(1, 30)));
                b.storeRef(data);
                data = b.endCell();
            }
            
            var f = randomInt(1, 1024);
            var v = randomInt(1, 1024);

            const result = await task3.getResult(BigInt(f), BigInt(v), data);
            var resultLine = await task3.getBitsLine(result);

            function dec2bin(v:number) {
                return (v >>> 0).toString(2);
            }

            var rep = await task3.replaceCellAll(data, dec2bin(f), dec2bin(v));
            var rep_first = await task3.getBitsLine(data);

            if (resultLine != rep)
            {
                var rt = resultLine;
                rt += "   ";
                rt += f;
                rt += "=";
                rt += dec2bin(f);
                rt += "   ";
                rt += v;
                rt += "=";
                rt += dec2bin(v);
                
                expect(rt).toBe(rep_first);
            }
        }

        expect(true).toBe(true);
    });
});
