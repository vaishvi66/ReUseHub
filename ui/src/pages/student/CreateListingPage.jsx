import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'
import { createItem } from '../../services/items'
import { useCategoriesQuery } from '../../hooks/useCategoriesQuery'

export default function CreateListingPage() {
  const { isVerified } = useAuth()
  const navigate = useNavigate()
  const { categories = [] } = useCategoriesQuery()

  const [form, setForm] = useState({
    name: '',
    description: '',
    category_id: '',
    listing_type: 'sell',
    price: '',
    condition: 'good',
    location: '',
    exchange_requirement: '',
  })
  const [image, setImage] = useState(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState('')

  if (!isVerified) {
    return (
      <main className="max-w-xl mx-auto px-4 py-16 text-center">
        <div className="w-16 h-16 bg-amber-100 dark:bg-amber-950/60 rounded-full mx-auto flex items-center justify-center text-amber-700 dark:text-amber-400 text-2xl font-bold mb-4">
          ⏳
        </div>
        <h2 className="text-xl font-bold text-slate-900 dark:text-white">Verification Required</h2>
        <p className="mt-2 text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
          Your student account is pending administrator verification. Once verified, you will be able to post listings on the campus marketplace.
        </p>
        <Link to="/dashboard" className="mt-6 inline-block px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-semibold transition">
          Return to Dashboard
        </Link>
      </main>
    )
  }

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setIsSubmitting(true)

    const formData = new FormData()
    formData.append('name', form.name)
    formData.append('description', form.description)
    formData.append('category_id', form.category_id)
    formData.append('listing_type', form.listing_type)
    formData.append('condition', form.condition)
    formData.append('location', form.location)
    if (form.listing_type === 'sell' && form.price) formData.append('price', form.price)
    if (form.listing_type === 'exchange') formData.append('exchange_requirement', form.exchange_requirement)
    if (image) formData.append('image', image)

    try {
      await createItem(formData)
      navigate('/my-listings')
    } catch (err) {
      const msg = err.response?.data?.detail || err.message || 'Failed to create listing.'
      setError(typeof msg === 'string' ? msg : JSON.stringify(msg))
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <main className="max-w-2xl mx-auto px-4 sm:px-6 py-8">
      <Link to="/my-listings" className="inline-flex items-center text-xs font-semibold text-slate-500 dark:text-slate-400 hover:text-emerald-700 dark:hover:text-emerald-400 mb-6 transition">
        &larr; Back to My Listings
      </Link>

      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-md p-6 sm:p-10 transition-colors">
        <div className="mb-6">
          <h1 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">Create Listing</h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            List an unused item. Your listing will be reviewed by campus admin before publishing.
          </p>
        </div>

        {error && (
          <div className="p-3.5 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800/60 text-rose-700 dark:text-rose-300 text-xs font-medium mb-6">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5" htmlFor="name">
              Item Title
            </label>
            <input
              id="name"
              name="name"
              type="text"
              required
              maxLength={120}
              placeholder="e.g. Casio fx-991EX Scientific Calculator"
              value={form.name}
              onChange={handleChange}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5" htmlFor="category_id">
                Category
              </label>
              <select
                id="category_id"
                name="category_id"
                required
                value={form.category_id}
                onChange={handleChange}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-sm bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:outline-none cursor-pointer"
              >
                <option value="">Select Category</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5" htmlFor="listing_type">
                Listing Type
              </label>
              <select
                id="listing_type"
                name="listing_type"
                value={form.listing_type}
                onChange={handleChange}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-sm bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:outline-none cursor-pointer"
              >
                <option value="sell">Sell (Offline Payment)</option>
                <option value="giveaway">Free Giveaway</option>
                <option value="exchange">Exchange</option>
              </select>
            </div>
          </div>

          {form.listing_type === 'sell' && (
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5" htmlFor="price">
                Price ($)
              </label>
              <input
                id="price"
                name="price"
                type="number"
                min="1"
                required
                placeholder="e.g. 450"
                value={form.price}
                onChange={handleChange}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              />
            </div>
          )}

          {form.listing_type === 'exchange' && (
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5" htmlFor="exchange_requirement">
                What item do you want in exchange?
              </label>
              <input
                id="exchange_requirement"
                name="exchange_requirement"
                type="text"
                required
                placeholder="e.g. Looking for 3rd sem Database textbook"
                value={form.exchange_requirement}
                onChange={handleChange}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              />
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5" htmlFor="condition">
                Condition
              </label>
              <select
                id="condition"
                name="condition"
                value={form.condition}
                onChange={handleChange}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-sm bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:outline-none cursor-pointer"
              >
                <option value="new">New</option>
                <option value="like_new">Like New</option>
                <option value="good">Good</option>
                <option value="fair">Fair</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5" htmlFor="location">
                Campus Location
              </label>
              <input
                id="location"
                name="location"
                type="text"
                required
                maxLength={150}
                placeholder="e.g. Library Gate / Hostel Block A"
                value={form.location}
                onChange={handleChange}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5" htmlFor="description">
              Description
            </label>
            <textarea
              id="description"
              name="description"
              rows={4}
              required
              placeholder="Provide key details about condition, usage, edition..."
              value={form.description}
              onChange={handleChange}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5" htmlFor="item_image">
              Item Photo (Optional, JPEG/PNG/WEBP, Max 5MB)
            </label>
            <input
              id="item_image"
              type="file"
              accept="image/jpeg,image/png,image/webp"
              onChange={(e) => setImage(e.target.files[0])}
              className="w-full text-xs text-slate-500 dark:text-slate-400 file:mr-3 file:py-2 file:px-3 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-emerald-50 dark:file:bg-emerald-950/60 file:text-emerald-700 dark:file:text-emerald-300 hover:file:bg-emerald-100 dark:hover:file:bg-emerald-900/40 cursor-pointer"
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full mt-4 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-sm font-bold shadow-md shadow-emerald-200 dark:shadow-none disabled:opacity-50 transition cursor-pointer"
          >
            {isSubmitting ? 'Submitting...' : 'Post Listing for Review'}
          </button>
        </form>
      </div>
    </main>
  )
}
