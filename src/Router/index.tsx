import { Route, Routes, Navigate } from 'react-router-dom'
import Home from '../page/Homepage';
import SearchPage from '../page/Homepage/components/Frontpage/SearchPage'

const PathURL = import.meta.env.VITE_PATH || '/FA';
export function Router() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to={PathURL} replace />} />

      <Route path={PathURL}>
        <Route index element={<Home />} />
        <Route path="stocksearch" element={<SearchPage />} />
      </Route>
      
      <Route path="*" element={<Navigate to={PathURL} replace />} />
    </Routes>
  )
}

