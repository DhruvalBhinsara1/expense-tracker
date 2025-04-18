import { useState, useEffect } from 'react';
import './index.css';

function App() {
  const [transactions, setTransactions] = useState([]);
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('Food');
  const [type, setType] = useState('Expense');
  const [editingId, setEditingId] = useState(null);

  // Load transactions from localStorage on mount
  useEffect(() => {
    const storedTransactions = localStorage.getItem('transactions');
    if (storedTransactions) {
      setTransactions(JSON.parse(storedTransactions));
    }
  }, []);

  // Save transactions to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('transactions', JSON.stringify(transactions));
  }, [transactions]);

  const handleAddOrUpdateTransaction = (e) => {
    e.preventDefault();
    if (!description || !amount) return;

    const transactionAmount = type === 'Income' ? parseFloat(amount) : -parseFloat(amount);
    const transactionCategory = type === 'Income' ? null : category;

    if (editingId) {
      // Update existing transaction
      setTransactions(
        transactions.map((transaction) =>
          transaction.id === editingId
            ? { ...transaction, description, amount: transactionAmount, category: transactionCategory, type }
            : transaction
        )
      );
      setEditingId(null);
    } else {
      // Add new transaction
      const newTransaction = {
        id: Date.now(),
        description,
        amount: transactionAmount,
        category: transactionCategory,
        type,
      };
      setTransactions([newTransaction, ...transactions]);
    }

    setDescription('');
    setAmount('');
    setCategory('Food');
    setType('Expense');
  };

  const handleEditTransaction = (transaction) => {
    setEditingId(transaction.id);
    setDescription(transaction.description);
    setAmount(Math.abs(transaction.amount).toString());
    setCategory(transaction.category || 'Food');
    setType(transaction.type);
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setDescription('');
    setAmount('');
    setCategory('Food');
    setType('Expense');
  };

  const handleDeleteTransaction = (id) => {
    setTransactions(transactions.filter((transaction) => transaction.id !== id));
    if (editingId === id) {
      handleCancelEdit();
    }
  };

  const totalBalance = transactions.reduce((sum, transaction) => sum + transaction.amount, 0);
  const displayedTransactions = transactions.slice(0, 5);

  return (
    <div className="container">
      <h1>Money Tracker</h1>
      <div className="balance">
        <h2>Total Balance: ₹{totalBalance.toFixed(2)}</h2>
      </div>
      <form onSubmit={handleAddOrUpdateTransaction} className="transaction-form">
        <input
          type="text"
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <input
          type="number"
          placeholder="Amount (₹)"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          step="0.01"
        />
        {type === 'Expense' && (
          <select value={category} onChange={(e) => setCategory(e.target.value)}>
            <option value="Food">Food</option>
            <option value="Transport">Transport</option>
            <option value="Entertainment">Entertainment</option>
            <option value="Other">Other</option>
          </select>
        )}
        <select value={type} onChange={(e) => setType(e.target.value)}>
          <option value="Expense">Expense</option>
          <option value="Income">Income</option>
        </select>
        <div className="form-buttons">
          <button type="submit">{editingId ? 'Update' : 'Add Transaction'}</button>
          {editingId && (
            <button type="button" className="cancel-btn" onClick={handleCancelEdit}>
              Cancel
            </button>
          )}
        </div>
      </form>
      <div className="transaction-list">
        <h3>Recent Transactions</h3>
        {displayedTransactions.length === 0 ? (
          <p>No transactions yet.</p>
        ) : (
          <ul>
            {displayedTransactions.map((transaction) => (
              <li key={transaction.id}>
                <span>{transaction.description}</span>
                <span className={transaction.type === 'Income' ? 'income' : 'expense'}>
                  {transaction.type === 'Income' ? '+' : '-'}₹{Math.abs(transaction.amount).toFixed(2)}
                </span>
                <span>{transaction.category || 'N/A'}</span>
                <span>{transaction.type}</span>
                <div className="transaction-actions">
                  <button
                    className="edit-btn"
                    onClick={() => handleEditTransaction(transaction)}
                  >
                    Edit
                  </button>
                  <button
                    className="delete-btn"
                    onClick={() => handleDeleteTransaction(transaction.id)}
                  >
                    Delete
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
      <div
        style={{
          textAlign: 'center',
          marginTop: '20px',
          paddingTop: '10px',
          borderTop: '1px solid #444',
          color: '#a0a0a0',
          fontSize: '0.9rem',
        }}
      >
        Made by Dhruval Bhinsara with ❤️
      </div>
    </div>
  );
}

export default App;