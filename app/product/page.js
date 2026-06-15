"use client";
import { useState, useMemo, useEffect, useRef } from 'react';
import { Heart, Star, ArrowUpDown, ChevronDown, SlidersHorizontal } from 'lucide-react';

const PRODUCTS = [
  { id: 1, brand: "SONIX", name: "Aurora Wireless Noise-Cancelling Headphones", rating: 4.8, reviews: 1264, price: 129.99, originalPrice: 199.99, discount: "-35%", category: "Electronics", image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=600&q=80", bgType: "warm", stockText: "Only 2 left!" },
  { id: 2, brand: "MARAKESH", name: "Heritage Gold Automatic Wristwatch", rating: 4.7, reviews: 842, price: 249.00, originalPrice: 399.99, discount: "-38%", category: "Accessories", image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=600&q=80", bgType: "warm" },
  { id: 3, brand: "PACE", name: "Emerald Runner Performance Sneakers", rating: 4.6, reviews: 2310, price: 89.50, originalPrice: 129.99, discount: "-31%", category: "Fashion", image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=600&q=80", bgType: "warm" },
  { id: 4, brand: "LUMIÈRE", name: "Pure Glow Vitamin C Brightening Serum", rating: 4.9, reviews: 4120, price: 34.00, originalPrice: 49.00, discount: "-31%", category: "Beauty", image: "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&w=600&q=80", bgType: "warm" },
  { id: 5, brand: "LAGOS LOOM", name: "Royal Ankara Print Wax Fabric — 6 yards", rating: 4.8, reviews: 860, price: 59.00, originalPrice: 79.00, discount: "-25%", category: "Fashion", image: "https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=600&q=80", bgType: "warm" },
  { id: 6, brand: "NOVA", name: "Nova X12 Pro Smartphone 256GB", rating: 4.7, reviews: 1560, price: 549.00, originalPrice: 699.99, discount: "-21%", category: "Electronics", image: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=600&q=80", bgType: "emerald", stockText: "Only 3 left!" },
  { id: 7, brand: "SONIX", name: "Aurora Wireless Noise-Cancelling Headphones — Edition 2", rating: 4.8, reviews: 1184, price: 138.49, originalPrice: 199.99, discount: "-30%", category: "Electronics", image: "https://images.unsplash.com/photo-1484704849700-f032a568e944?auto=format&fit=crop&w=600&q=80", bgType: "warm", stockText: "Only 2 left!" },
  { id: 8, brand: "MARAKESH", name: "Heritage Gold Automatic Wristwatch — Edition 2", rating: 4.7, reviews: 542, price: 261.45, originalPrice: 419.99, discount: "-38%", category: "Accessories", image: "https://images.unsplash.com/photo-1524592094714-0f0654e20314?auto=format&fit=crop&w=600&q=80", bgType: "warm" },
];

const CATEGORIES = ['All', 'Electronics', 'Fashion', 'Beauty', 'Groceries', 'Home & Living', 'Accessories'];
const BRANDS = ['All', 'Nova', 'Marakesh', 'Lumière', 'Sonix', 'Pace', 'Lagos Loom'];
const SORT_MODES = ['Most popular', 'Price: low to high', 'Price: high to low', 'Highest rated'];

export default function ProductCatalogSection() {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedBrand, setSelectedBrand] = useState('All');
  const [maxPrice, setMaxPrice] = useState(700);
  const [favorites, setFavorites] = useState(new Set([2, 4]));
  const [sortIdx, setSortIdx] = useState(0);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [sortOpen, setSortOpen] = useState(false);
  const sortRef = useRef(null);

  useEffect(() => {
    const handler = (e) => { 
      if (sortRef.current && !sortRef.current.contains(e.target)) {
        setSortOpen(false); 
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const toggleFavorite = (id) => {
    setFavorites(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const visibleProducts = useMemo(() => {
    let list = PRODUCTS.filter(p => {
      const catOk = selectedCategory === 'All' || p.category === selectedCategory;
      const brandOk = selectedBrand === 'All' || p.brand.toUpperCase() === selectedBrand.toUpperCase();
      const priceOk = p.price <= maxPrice;
      return catOk && brandOk && priceOk;
    });
    if (sortIdx === 1) list = [...list].sort((a, b) => a.price - b.price);
    else if (sortIdx === 2) list = [...list].sort((a, b) => b.price - a.price);
    else if (sortIdx === 3) list = [...list].sort((a, b) => b.rating - a.rating);
    else list = [...list].sort((a, b) => b.reviews - a.reviews);
    return list;
  }, [selectedCategory, selectedBrand, maxPrice, sortIdx]);

  const clearFilters = () => {
    setSelectedCategory('All');
    setSelectedBrand('All');
    setMaxPrice(700);
  };

  const Sidebar = () => (
    <aside className="bg-white border border-gray-200/80 rounded-2xl p-5 shadow-sm h-fit">
      {/* Category */}
      <div className="mb-5">
        <h3 className="text-[9px] font-black tracking-widest text-gray-400 uppercase mb-3">Category</h3>
        <div className="space-y-2">
          {CATEGORIES.map(cat => (
            <label key={cat} className="flex items-center gap-3 cursor-pointer select-none">
              <input
                type="radio"
                name="category"
                checked={selectedCategory === cat}
                onChange={() => setSelectedCategory(cat)}
                className="h-3.5 w-3.5 accent-[#005A36] cursor-pointer"
              />
              <span className={`text-xs font-bold ${selectedCategory === cat ? 'text-gray-900 font-black' : 'text-gray-500'}`}>
                {cat}
              </span>
            </label>
          ))}
        </div>
      </div>

      <hr className="border-gray-100 my-4" />

      {/* Brand */}
      <div className="mb-5">
        <h3 className="text-[9px] font-black tracking-widest text-gray-400 uppercase mb-3">Brand</h3>
        <div className="space-y-2">
          {BRANDS.map(brand => (
            <label key={brand} className="flex items-center gap-3 cursor-pointer select-none">
              <input
                type="radio"
                name="brand"
                checked={selectedBrand === brand}
                onChange={() => setSelectedBrand(brand)}
                className="h-3.5 w-3.5 accent-[#005A36] cursor-pointer"
              />
              <span className={`text-xs font-bold ${selectedBrand === brand ? 'text-gray-900 font-black' : 'text-gray-500'}`}>
                {brand}
              </span>
            </label>
          ))}
        </div>
      </div>

      <hr className="border-gray-100 my-4" />

      {/* Price */}
      <div className="mb-5">
        <div className="flex justify-between items-center mb-3">
          <h3 className="text-[9px] font-black tracking-widest text-gray-400 uppercase">Max Price</h3>
          <span className="text-xs font-black text-[#005A36]">${maxPrice}</span>
        </div>
        <input
          type="range"
          min="10"
          max="700"
          step="1"
          value={maxPrice}
          onChange={e => setMaxPrice(Number(e.target.value))}
          className="w-full h-1 rounded-lg appearance-none cursor-pointer accent-[#005A36]"
        />
      </div>

      <button
        onClick={clearFilters}
        className="w-full py-2 bg-transparent hover:bg-gray-50 border border-gray-200 rounded-full text-xs font-bold text-gray-500 transition-colors"
      >
        Clear filters
      </button>
    </aside>
  );

  return (
    <div className="w-full bg-[#FAF8F5] text-[#0A1828] font-sans antialiased pb-20">

      {/* Banner */}
      <div className="w-full pt-10 pb-5 px-6 max-w-7xl mx-auto">
        <span className="text-[10px] uppercase tracking-widest text-[#005A36] font-extrabold block mb-1">Catalog</span>
        <h1 className="text-3xl font-black text-gray-900 tracking-tight mb-1">All Products</h1>
        <p className="text-xs text-gray-400 font-medium">
          {visibleProducts.length} of {PRODUCTS.length} items from trusted sellers
        </p>
      </div>

      <div className="max-w-7xl w-full mx-auto px-6 flex flex-col lg:grid lg:grid-cols-12 gap-6">

        {/* Mobile filter toggle */}
        <div className="lg:hidden">
          <button
            onClick={() => setFiltersOpen(o => !o)}
            className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-xl text-xs font-bold text-gray-600 shadow-sm"
          >
            <SlidersHorizontal className="h-3.5 w-3.5" />
            Filters
            <ChevronDown className={`h-3.5 w-3.5 transition-transform ${filtersOpen ? 'rotate-180' : ''}`} />
          </button>
          {filtersOpen && (
            <div className="mt-3">
              <Sidebar />
            </div>
          )}
        </div>

        {/* Desktop sidebar */}
        <aside className="hidden lg:block lg:col-span-3 sticky top-4 self-start">
          <Sidebar />
        </aside>

        {/* Product grid */}
        <main className="lg:col-span-9 space-y-4">

          {/* Toolbar */}
          <div className="flex justify-between items-center">
            <p className="text-xs font-semibold text-gray-400">
              Showing <span className="text-gray-900 font-bold">{visibleProducts.length}</span> products
            </p>
            <div className="relative" ref={sortRef}>
              <button
                onClick={() => setSortOpen(o => !o)}
                className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-xl text-xs font-bold text-gray-700 shadow-sm hover:bg-gray-50 transition-colors"
              >
                <ArrowUpDown className="h-3.5 w-3.5 text-gray-400" />
                {SORT_MODES[sortIdx]}
                <ChevronDown className={`h-3.5 w-3.5 text-gray-400 transition-transform ${sortOpen ? 'rotate-180' : ''}`} />
              </button>
              {sortOpen && (
                <div className="absolute right-0 top-full mt-1.5 w-48 bg-white border border-gray-200 rounded-xl shadow-lg z-50 overflow-hidden">
                  {SORT_MODES.map((mode, i) => (
                    <button
                      key={mode}
                      onClick={() => { setSortIdx(i); setSortOpen(false); }}
                      className={`w-full text-left px-4 py-2.5 text-xs font-bold transition-colors ${
                        i === sortIdx
                          ? 'bg-[#005A36]/8 text-[#005A36]'
                          : 'text-gray-600 hover:bg-gray-50'
                      }`}
                    >
                      {mode}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Cards */}
          {visibleProducts.length === 0 ? (
            <div className="col-span-full text-center py-20 text-gray-400 text-sm">
              No products match your filters.
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-3">
              {visibleProducts.map(product => {
                const isEmerald = product.bgType === 'emerald';
                return (
                  <div
                    key={product.id}
                    className="bg-white border border-gray-200/60 rounded-[1.4rem] p-3 flex flex-col shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 group"
                  >
                    {/* Image */}
                    <div className={`w-full aspect-square rounded-3xl relative overflow-hidden flex items-center justify-center p-5 mb-3 ${
                      isEmerald
                        ? 'bg-linear-to-br from-[#005A36] via-[#01683E] to-[#7CB75D]'
                        : 'bg-linear-to-b from-[#F9F6F0] to-[#EFECE6]'
                    }`}>
                      <span className={`absolute top-2.5 left-2.5 text-[9px] font-black px-2 py-0.5 rounded-md z-10 ${
                        isEmerald ? 'bg-white/20 text-white backdrop-blur-sm' : 'bg-[#F9E2D8] text-[#D95F39]'
                      }`}>
                        {product.discount}
                      </span>

                      <button
                        onClick={() => toggleFavorite(product.id)}
                        className="absolute top-2.5 right-2.5 w-7 h-7 bg-white rounded-full flex items-center justify-center shadow-sm z-10 hover:scale-110 transition-transform"
                      >
                        <Heart className={`h-3.5 w-3.5 ${favorites.has(product.id) ? 'fill-[#D95F39] stroke-[#D95F39]' : 'stroke-gray-300'}`} />
                      </button>

                      <img
                        src={product.image}
                        alt={product.name}
                        className={`max-h-full max-w-full object-contain rounded-md group-hover:scale-105 transition-transform duration-300 ${!isEmerald ? 'mix-blend-multiply' : ''}`}
                      />

                      {/* Quick Add overlay */}
                      <div className="absolute inset-x-0 bottom-0 flex justify-center pb-3 opacity-0 translate-y-1 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-200 z-20">
                        <button
                          onClick={e => e.stopPropagation()}
                          className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-[11px] font-black shadow-md backdrop-blur-sm transition-transform active:scale-95 ${
                            isEmerald
                              ? 'bg-white/90 text-[#005A36] hover:bg-white'
                              : 'bg-[#0A1828]/85 text-white hover:bg-[#0A1828]'
                          }`}
                        >
                          <span className="text-base leading-none">+</span>
                          Quick Add
                        </button>
                      </div>
                    </div>

                    {/* Info */}
                    <div className="px-0.5 flex flex-col flex-1">
                      <span className="text-[8.5px] font-black tracking-wider text-gray-400 uppercase block mb-1">
                        {product.brand}
                      </span>
                      <h2 className="text-[11px] font-bold text-gray-800 line-clamp-2 leading-snug mb-2 min-h-8">
                        {product.name}
                      </h2>

                      <div className="flex items-center gap-1 mb-3">
                        <Star className="h-3 w-3 fill-amber-400 stroke-amber-400" />
                        <span className="text-[11px] font-black text-gray-800">{product.rating}</span>
                        <span className="text-[10px] text-gray-400 font-medium">({product.reviews.toLocaleString()})</span>
                      </div>

                      <div className="mt-auto">
                        <div className="flex items-baseline gap-1.5 mb-0.5">
                          <span className="text-sm font-black text-[#D95F39]">${product.price.toFixed(2)}</span>
                          <span className="text-[10px] text-gray-400 font-bold line-through">${product.originalPrice.toFixed(2)}</span>
                        </div>
                        <span className="text-[9.5px] text-red-500 font-extrabold block min-h-3.5">
                          {product.stockText || ''}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}