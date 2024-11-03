import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    ManyToOne,
    CreateDateColumn,
    UpdateDateColumn,
    JoinColumn,
  } from 'typeorm';
  import { User } from './User';
  
  @Entity('todos')
  export class Todo {
    @PrimaryGeneratedColumn('uuid')
    id!: string;
  
    @Column()
    title!: string;
  
    @Column({ nullable: true })
    description?: string;
  
    @Column({ default: false })
    completed!: boolean;
  
    @ManyToOne(() => User, (user) => user.todos, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'user' }) 
    user!: User;
  
    @CreateDateColumn({ name: 'created_at' })
    createdAt!: Date;
  
    @UpdateDateColumn({ name: 'updated_at' })
    updatedAt!: Date;
  }
  