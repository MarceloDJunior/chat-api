import { MigrationInterface, QueryRunner } from 'typeorm';

export class addAuth0ColumnsToUsers1676501930798 implements MigrationInterface {
  name = 'addAuth0ColumnsToUsers1676501930798';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "password"`);
    await queryRunner.query(
      `ALTER TABLE "users" ADD "picture" character varying`,
    );
    await queryRunner.query(
      `ALTER TABLE "users" ADD "auth0Id" character varying NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "messages" ALTER COLUMN "dateTime" SET DEFAULT now()`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "messages" ALTER COLUMN "dateTime" SET DEFAULT '2023-02-15 22:26:01.996'`,
    );
    await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "auth0Id"`);
    await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "picture"`);
    await queryRunner.query(
      `ALTER TABLE "users" ADD "password" character varying NOT NULL`,
    );
  }
}
