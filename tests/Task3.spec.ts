import { Blockchain, SandboxContract } from '@ton-community/sandbox';
import { Cell, toNano } from 'ton-core';
import { Task3 } from '../wrappers/Task3';
import '@ton-community/test-utils';
import { compile } from '@ton-community/blueprint';

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

    it('flag "122352346256" (1110001111100110001001010010010010000) - 19 bit', async () => {
        const encoded = await task3.getBitOfInt(122352346256, 19);
        expect(encoded).toBe(1n);
    });
});
