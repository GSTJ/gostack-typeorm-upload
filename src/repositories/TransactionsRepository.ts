import { EntityRepository, Repository } from 'typeorm';

import Transaction from '../models/Transaction';

interface Balance {
  income: number;
  outcome: number;
  total: number;
}

@EntityRepository(Transaction)
class TransactionsRepository extends Repository<Transaction> {
  public async getBalance(): Promise<Balance> {
    const { income } = await this.createQueryBuilder('transaction')
      .select('SUM(transaction.value)', 'income')
      .where('transaction.type = :type', { type: 'income' })
      .getRawOne();

    const { outcome } = await this.createQueryBuilder('transaction')
      .select('SUM(transaction.value)', 'outcome')
      .where('transaction.type = :type', { type: 'outcome' })
      .getRawOne();

    return {
      income: Number(income),
      outcome: Number(outcome),
      total: income - outcome,
    } as Balance;
  }
}

export default TransactionsRepository;
