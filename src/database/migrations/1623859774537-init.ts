import { MigrationInterface, QueryRunner } from 'typeorm';

export class init1623859774537 implements MigrationInterface {
  name = 'init1623859774537';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      'CREATE TABLE `users` (`id` int NOT NULL AUTO_INCREMENT, `name` varchar(100) NOT NULL, `lastName` varchar(100) NOT NULL, `email` varchar(64) NOT NULL, `phoneNumber` varchar(14) NOT NULL,  `cc` int(20) NOT NULL, `createdAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP, `updatedAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP, `deletedAt` timestamp  NULL,  PRIMARY KEY (`id`)) ENGINE=InnoDB',
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('DROP TABLE `users`');
  }
}
