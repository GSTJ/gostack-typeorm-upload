import csvtojson from 'csvtojson';
import Transaction from '../models/Transaction';
import CreateTransactionService from './CreateTransactionService';

interface Request {
  buffer: Buffer;
}

interface TransactionDTO {
  title: string;
  type: 'outcome' | 'income';
  value: string;
  category: string;
}

// TODO: Evaluate the logic on this service
class ImportTransactionsService {
  async execute({ buffer }: Request): Promise<Transaction[]> {
    const createTransactionService = new CreateTransactionService();
    const transactions = [];
    const data = await csvtojson().fromString(buffer.toString());
    // eslint-disable-next-line no-restricted-syntax
    for (const item of data) {
      const { title, type, value, category } = item as TransactionDTO;
      // eslint-disable-next-line no-await-in-loop
      const transaction = await createTransactionService.execute({
        title,
        type,
        value: Number(value),
        category,
      });
      transactions.push(transaction);
    }
    return transactions;
  }
}

export default ImportTransactionsService;
