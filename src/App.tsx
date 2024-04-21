import { useState, useEffect, FormEvent } from 'react'
import './App.css'

function App() {
  const [email, setEmail] = useState<string>('ykonishi@protonmail.com')
  const [password, setPassword] = useState<string>('stonesec1221')
  const [openAuthorizationDialog, setOpenAuthorizationDialog] = useState<boolean>(false)
  const [openExpenditureDialog, setOpenExpenditureDialog] = useState<boolean>(false)
  const [openIncomeDialog, setOpenIncomeDialog] = useState<boolean>(false)
  const [categories, setCategories] = useState<any[]>([])
  const [expenditures, setExpenditures] = useState<any[]>([])
  const [incomes, setIncomes] = useState<any[]>([])

  const onClickAuthorizationButton = () => {
    setOpenAuthorizationDialog(!openAuthorizationDialog)
  }

  const onClickExpenditureButton = () => {
    setOpenExpenditureDialog(!openExpenditureDialog)
  }

  const onClickIncomeButton = () => {
    setOpenIncomeDialog(!openIncomeDialog)
  }

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setOpenAuthorizationDialog(false)

    const expendituresUrl = new URL('http://localhost:8000/api/expenditures/')
    fetch(expendituresUrl.href, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: "Basic " + btoa(`${email}:${password}`)
      }
    })
      .then(res => res.json())
      .then(data => setExpenditures(data['results']))

    const incomesUrl = new URL('http://localhost:8000/api/incomes/')
    fetch(incomesUrl.href, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: "Basic " + btoa(`${email}:${password}`)
      }
    })
      .then(res => res.json())
      .then(data => setIncomes(data['results']))
  }

  const handleSubmitExpenditure = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setOpenExpenditureDialog(false)

      const expendituresUrl = new URL('http://localhost:8000/api/expenditures/')
      fetch(expendituresUrl.href, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: "Basic " + btoa(`${email}:${password}`)
        },
        body: JSON.stringify({
          category: 1,
          event_date: '2024-04-21',
          amount: 1000,
          memo: '食費'
        })
      })
        .then(res => res.json())
        .then(data => setExpenditures([...expenditures, data]))
  }

  const handleSubmitIncome = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setOpenIncomeDialog(false)

      const incomesUrl = new URL('http://localhost:8000/api/incomes/')
      fetch(incomesUrl.href, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: "Basic " + btoa(`${email}:${password}`)
        },
        body: JSON.stringify({
          category: 2,
          event_date: '2021-09-01',
          amount: 10000,
          memo: '給与'
        })
      })
        .then(res => res.json())
        .then(data => setIncomes([...incomes, data]))
  }

  useEffect(() => {
    const categoriesUrl = new URL('http://localhost:8000/api/categories/')
    fetch(categoriesUrl.href, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: "Basic " + btoa(`${email}:${password}`)
      }
    })
      .then(res => res.json())
      .then(data => setCategories(data['results']))
  }, []);

  return (
    <>
      <header>
        <h1>家計簿</h1>
      </header>
      <div className="menu-buttons">
        <button onClick={onClickAuthorizationButton}>
          認証情報をセットする
        </button>
        <button onClick={onClickExpenditureButton}>
          支出を追加する
        </button>
        <button onClick={onClickIncomeButton}>
          収入を追加する
        </button>
      </div>
      <dialog className="authorization-dialog" open={openAuthorizationDialog}>
        <form method="dialog" className="authorization-form" onSubmit={handleSubmit}>
          <div className="form-row">
            <label>メールアドレス</label>
            <input type="email" defaultValue={email} onChange={(e: FormEvent<HTMLInputElement>) => setEmail(e.currentTarget.value)} />
          </div>
          <div className="form-row">
            <label>パスワード</label>
            <input type="password" defaultValue={password} onChange={(e: FormEvent<HTMLInputElement>) => setPassword(e.currentTarget.value)} />
          </div>
          <div className="form-button">
            <button>セットする</button>
          </div>
        </form>
      </dialog>
      <dialog className="expenditure-dialog" open={openExpenditureDialog}>
        <form method="dialog" className="expenditure-form" onSubmit={handleSubmitExpenditure}>
          <div className="form-row">
            <label>カテゴリー</label>
            <select>
              {categories.map((category) => {
                if (category.label === 'expenditure') return (
                  <option key={category['id']} value={category['id']}>{category['name']}</option>
                )
              })}
            </select>
          </div>
          <div className="form-row">
            <label>日付</label>
            <input type="date" />
          </div>
          <div className="form-row">
            <label>金額</label>
            <input type="number" />
          </div>
          <div className="form-row">
            <label>メモ</label>
            <input type="text" />
          </div>
          <div className="form-button">
            <button>追加する</button>
          </div>
        </form>
      </dialog>
      <dialog className="income-dialog" open={openIncomeDialog}>
        <form method="dialog" className="income-form" onSubmit={handleSubmitIncome}>
          <div className="form-row">
            <label>カテゴリー</label>
            <select>
              {categories.map((category) => {
                if (category.label === 'income') return (
                  <option key={category['id']} value={category['id']}>{category['name']}</option>
                )
              })}
            </select>
          </div>
          <div className="form-row">
            <label>日付</label>
            <input type="date" />
          </div>
          <div className="form-row">
            <label>金額</label>
            <input type="number" />
          </div>
          <div className="form-row">
            <label>メモ</label>
            <input type="text" />
          </div>
          <div className="form-button">
            <button>追加する</button>
          </div>
        </form>
      </dialog>
      <table>
        <thead>
          <tr>
            <th></th>
            <th>カテゴリー</th>
            <th>日付</th>
            <th>金額</th>
            <th>メモ</th>
          </tr>
        </thead>
        <tbody>
          {expenditures.map((expenditure) => {
            return (
              <tr key={expenditure['id']}>
                <td>支出</td>
                <td>{categories.find(category => category.id === expenditure.category)?.name}</td>
                <td>{expenditure['event_date']}</td>
                <td>{expenditure['amount']}</td>
                <td>{expenditure['memo']}</td>
              </tr>
            )
          })}
          {incomes.map((income) => {
            return (
              <tr key={income['id']}>
                <td>収入</td>
                <td>{categories.find(category => category.id === income.category)?.name}</td>
                <td>{income['event_date']}</td>
                <td>{income['amount']}</td>
                <td>{income['memo']}</td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </>
  )
}

export default App