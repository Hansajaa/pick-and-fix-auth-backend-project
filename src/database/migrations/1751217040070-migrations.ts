import { MigrationInterface, QueryRunner } from "typeorm";

export class Migrations1751217040070 implements MigrationInterface {
    name = 'Migrations1751217040070'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`tbl_role\` (\`id\` int NOT NULL AUTO_INCREMENT, \`name\` varchar(767) NOT NULL, \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`deletedAt\` datetime(6) NULL, UNIQUE INDEX \`IDX_9202294311d3253394ec1a84c9\` (\`name\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`tbl_user_role\` (\`id\` int NOT NULL AUTO_INCREMENT, \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`deletedAt\` datetime(6) NULL, \`user\` int NOT NULL, \`role\` int NOT NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`tbl_user_role\` ADD CONSTRAINT \`FK_f7e3902269317755e7ac506b880\` FOREIGN KEY (\`user\`) REFERENCES \`tbl_user\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`tbl_user_role\` ADD CONSTRAINT \`FK_0f8ed8dbc7f115e990cdf05cf50\` FOREIGN KEY (\`role\`) REFERENCES \`tbl_role\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`tbl_user_role\` DROP FOREIGN KEY \`FK_0f8ed8dbc7f115e990cdf05cf50\``);
        await queryRunner.query(`ALTER TABLE \`tbl_user_role\` DROP FOREIGN KEY \`FK_f7e3902269317755e7ac506b880\``);
        await queryRunner.query(`DROP TABLE \`tbl_user_role\``);
        await queryRunner.query(`DROP INDEX \`IDX_9202294311d3253394ec1a84c9\` ON \`tbl_role\``);
        await queryRunner.query(`DROP TABLE \`tbl_role\``);
    }

}
