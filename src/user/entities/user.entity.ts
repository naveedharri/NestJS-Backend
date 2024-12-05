import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  Index,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  userId: number; // Primary key for unique identification of users.

  @Column({ type: 'varchar', length: 100 })
  @Index() // Adding an index on 'name' for optimizing sorting queries by name.
  name: string;

  @Column({ type: 'varchar', length: 150, unique: true })
  email: string; // Unique constraint to ensure no duplicate email addresses are stored.

  @Column({ type: 'int' })
  age: number; // Age used for filtering queries.

  @Column({ type: 'varchar', length: 20, default: 'active' })
  status: string; // Status to indicate the state of the user (e.g., 'active', 'inactive').

  @CreateDateColumn()
  createdAt: Date; // Automatically populated when a new record is created.

  @UpdateDateColumn()
  updatedAt: Date; // Automatically updated whenever the record is updated.
}
