import { getCustomRepository, getRepository } from 'typeorm';
import AppError from '../errors/AppError';

import Transaction from '../models/Transaction';
import TransactionsRepository from '../repositories/TransactionsRepository';
import Category from '../models/Category';

interface Request {
  title: string;
  type: 'income' | 'outcome';
  value: number;
  category: string;
}

class CreateTransactionService {
  public async execute({
    title,
    value,
    type,
    category,
  }: Request): Promise<Transaction> {
    const transactionRepository = getCustomRepository(TransactionsRepository);

    const balance = await transactionRepository.getBalance();

    if (type === 'outcome' && balance.total < value) {
      throw new AppError('Insufficient balance for transaction.');
    }

    const category_id = await this.resolveCategory(category);

    const transaction = transactionRepository.create({
      title,
      value,
      type,
      category_id,
    });

    await transactionRepository.save(transaction);

    return transaction;
  }

  private async resolveCategory(category_title: string): Promise<string> {
    const categoriesRepository = getRepository(Category);

    let categoryModel = await categoriesRepository.findOne({
      where: { title: category_title },
    });

    if (!categoryModel) {
      const newCategory = categoriesRepository.create({
        title: category_title,
      });

      categoryModel = await categoriesRepository.save(newCategory);
    }

    return categoryModel.id;
  }
}

export default CreateTransactionService;
