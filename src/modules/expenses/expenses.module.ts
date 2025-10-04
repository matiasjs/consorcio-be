import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ExpensesService } from './expenses.service';
import { ExpensesController } from './expenses.controller';
import {
  Expense,
  ExpenseItem,
  ExpenseDistribution,
  Unit,
  VendorInvoice,
  Building,
} from '../../entities';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Expense,
      ExpenseItem,
      ExpenseDistribution,
      Unit,
      VendorInvoice,
      Building,
    ]),
  ],
  controllers: [ExpensesController],
  providers: [ExpensesService],
  exports: [ExpensesService],
})
export class ExpensesModule {}
