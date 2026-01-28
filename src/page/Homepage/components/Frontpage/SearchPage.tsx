import React, { useState } from 'react'
import './SearchPage.css'
import StockAnalysis from './StockAnalysis'
import { useNavigate } from 'react-router-dom'

function SearchPage() {
  const [searchInput, setSearchInput] = useState('')
  const [recentSearches, setRecentSearches] = useState<string[]>([])
  const [selectedStock, setSelectedStock] = useState<string | null>(null)
  const navigate = useNavigate()

  const handleSearch = () => {
    if (searchInput.trim()) {
      const stockCode = searchInput.trim()
      // 如果已存在，先移除
      const filtered = recentSearches.filter(item => item !== stockCode)
      // 添加到数组最前面
      const updated = [stockCode, ...filtered]
      // 只保留最多12个
      setRecentSearches(updated.slice(0, 12))
      setSearchInput('')
      // 设置选中的股票
      setSelectedStock(stockCode)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSearch()
    }
  }

  const handleRecentClick = (stockCode: string) => {
    setSearchInput(stockCode)
    // 设置选中的股票
    setSelectedStock(stockCode)
  }

  const handleBack = () => {
    navigate('/')
  }
  
  return (
    <div className="search-page">
      <div className="search-header-section">
        
        <h1 className="page-title" onClick={handleBack}>金融投資策略</h1>
        <div className="search-bar-wrapper">
          <div className="search-icon">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="8"></circle>
              <path d="m21 21-4.35-4.35"></path>
            </svg>
          </div>
          <input
            type="text"
            className="search-input"
            placeholder="搜尋股票代碼或名稱..."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            onKeyPress={handleKeyPress}
          />
        </div>
      </div>

      <div className="search-content-section">
        {selectedStock ? (
          <div className="stock-analysis-wrapper">
            <StockAnalysis stockCode={selectedStock} />
          </div>
        ) : (
          <>
            <div className="start-analysis-section">
              <h2 className="start-analysis-title">開始分析</h2>
              <p className="start-analysis-description">
                搜尋股票代碼以查看詳細的技術分析和投資建議
              </p>
            </div>

            {recentSearches.length > 0 && (
              <div className="recent-searches-section">
                <h3 className="recent-searches-title">最近搜尋</h3>
                <div className="recent-searches-grid">
                  {recentSearches.map((stockCode, index) => (
                    <button
                      key={index}
                      className="recent-search-button"
                      onClick={() => handleRecentClick(stockCode)}
                    >
                      {stockCode}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}

export default SearchPage