import { useState, useEffect } from 'react'
import { listStudents, verifyStudent, activateStudent, deactivateStudent } from '../../services/admin'

export default function StudentsPage() {
  const [students, setStudents] = useState([])
  const [filter, setFilter] = useState('')
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(true)
  const [actionError, setActionError] = useState('')

  const loadStudents = () => {
    setLoading(true)
    listStudents(filter || undefined)
      .then((data) => {
        setStudents(Array.isArray(data) ? data : [])
        setActionError('')
      })
      .catch((err) => {
        setStudents([])
        setActionError(err.response?.data?.detail || 'Failed to load students.')
      })
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    loadStudents()
  }, [filter])

  const handleAction = async (fn) => {
    setActionError('')
    try {
      await fn()
      loadStudents()
    } catch (err) {
      setActionError(err.response?.data?.detail || 'Action failed.')
    }
  }

  const filtered = students.filter((s) => {
    const q = search.toLowerCase()
    return (
      !q ||
      s.full_name?.toLowerCase().includes(q) ||
      s.email?.toLowerCase().includes(q) ||
      s.student_id?.toLowerCase().includes(q) ||
      s.college?.toLowerCase().includes(q)
    )
  })

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">Student Accounts</h1>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Verify student IDs and manage campus platform access</p>
      </div>

      {actionError && (
        <div className="p-3.5 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800/60 text-rose-700 dark:text-rose-300 text-xs font-medium mb-6">
          {actionError}
        </div>
      )}

      {/* Controls Bar */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 p-4 mb-6 shadow-xs flex flex-col md:flex-row gap-3 items-center justify-between transition-colors">
        <div className="w-full md:w-80">
          <input
            type="text"
            placeholder="Search by student ID, name, email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none"
          />
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto overflow-x-auto">
          {['', 'pending', 'approved', 'rejected'].map((st) => (
            <button
              key={st}
              onClick={() => setFilter(st)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold capitalize transition cursor-pointer shrink-0 ${
                filter === st
                  ? 'bg-slate-900 dark:bg-emerald-600 text-white'
                  : 'bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300'
              }`}
            >
              {st === '' ? 'All Students' : st}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="space-y-3 animate-pulse">
          {[1, 2, 3, 4].map((n) => (
            <div key={n} className="h-16 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800" />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="rounded-3xl border border-dashed border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 p-12 text-center max-w-md mx-auto">
          <p className="text-slate-800 dark:text-slate-200 font-bold text-base">No students found</p>
          <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">No student accounts matched your search or status filter.</p>
        </div>
      ) : (
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-xs overflow-hidden transition-colors">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 dark:bg-slate-950/60 border-b border-slate-200 dark:border-slate-800 text-slate-400 dark:text-slate-500 font-semibold uppercase tracking-wider">
                <tr>
                  <th className="py-3 px-4">Student ID</th>
                  <th className="py-3 px-4">Name</th>
                  <th className="py-3 px-4">College</th>
                  <th className="py-3 px-4">Email</th>
                  <th className="py-3 px-4">Verification</th>
                  <th className="py-3 px-4">Account Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {filtered.map((s) => (
                  <tr key={s.id} className="hover:bg-slate-50/60 dark:hover:bg-slate-800/40 transition">
                    <td className="py-4 px-4 font-mono font-bold text-slate-900 dark:text-white">{s.student_id || '-'}</td>
                    <td className="py-4 px-4 font-semibold text-slate-800 dark:text-slate-200">{s.full_name}</td>
                    <td className="py-4 px-4 text-slate-500 dark:text-slate-400">{s.college}</td>
                    <td className="py-4 px-4 text-slate-500 dark:text-slate-400">{s.email}</td>
                    <td className="py-4 px-4">
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full capitalize ${
                          s.verification_status === 'approved'
                            ? 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300'
                            : s.verification_status === 'rejected'
                              ? 'bg-rose-100 dark:bg-rose-950/60 text-rose-800 dark:text-rose-300'
                              : 'bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300'
                        }`}
                      >
                        {s.verification_status}
                      </span>
                    </td>
                    <td className="py-4 px-4">
                      <span
                        className={`text-[10px] font-semibold px-2 py-0.5 rounded-md ${
                          s.is_active ? 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300' : 'bg-rose-50 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300'
                        }`}
                      >
                        {s.is_active ? 'Active' : 'Deactivated'}
                      </span>
                    </td>
                    <td className="py-4 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5 flex-wrap">
                        {s.verification_status === 'pending' && (
                          <>
                            <button
                              onClick={() => handleAction(() => verifyStudent(s.id, 'approve'))}
                              className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg transition cursor-pointer"
                            >
                              Approve
                            </button>
                            <button
                              onClick={() => handleAction(() => verifyStudent(s.id, 'reject'))}
                              className="px-2.5 py-1 bg-rose-50 dark:bg-rose-950/40 hover:bg-rose-100 dark:hover:bg-rose-900/50 text-rose-700 dark:text-rose-300 font-semibold rounded-lg transition cursor-pointer"
                            >
                              Reject
                            </button>
                          </>
                        )}
                        {s.is_active ? (
                          <button
                            onClick={() => handleAction(() => deactivateStudent(s.id))}
                            className="px-2.5 py-1 text-slate-500 dark:text-slate-400 hover:text-rose-700 dark:hover:text-rose-400 hover:bg-slate-100 dark:hover:bg-slate-800 font-medium rounded-lg transition cursor-pointer"
                          >
                            Deactivate
                          </button>
                        ) : (
                          <button
                            onClick={() => handleAction(() => activateStudent(s.id))}
                            className="px-2.5 py-1 bg-slate-900 dark:bg-emerald-600 hover:bg-black dark:hover:bg-emerald-700 text-white font-semibold rounded-lg transition cursor-pointer"
                          >
                            Activate
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </main>
  )
}
