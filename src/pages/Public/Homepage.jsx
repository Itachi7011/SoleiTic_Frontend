import React, { useState, useEffect, useContext, useRef } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import { ThemeContext } from '../../context/ThemeContext';

const SoleiTicHomepage = () => {
  const { isDarkMode } = useContext(ThemeContext);
  const [heroData, setHeroData] = useState(null);
  const [featuredWatches, setFeaturedWatches] = useState([]);
  const [collections, setCollections] = useState([]);
  const [testimonials, setTestimonials] = useState([]);
  const [brandStory, setBrandStory] = useState(null);
  const [craftsmanship, setCraftsmanship] = useState([]);
  const [newsArticles, setNewsArticles] = useState([]);
  const [isAdmin, setIsAdmin] = useState(true); // Set based on user role
  const [dataLoaded, setDataLoaded] = useState(false);
  const heroRef = useRef(null);
  const watchesRef = useRef(null);

  // Comprehensive fallback data
  const fallbackData = {
    hero: {
      title: 'Timeless Elegance, Crafted to Perfection',
      subtitle: 'Discover luxury timepieces that define sophistication and precision'
    },
    featuredWatches: [
      {
        _id: 'fallback-1',
        name: 'Heritage Chronograph',
        brand: 'SoleiTic',
        price: 12500,
        image: 'https://images.unsplash.com/photo-1523170335258-f5ed11844a49?w=400',
        description: 'Automatic chronograph with moon phase complication and 72-hour power reserve. Features a sapphire crystal case back showcasing the meticulously finished movement.'
      },
      {
        _id: 'fallback-2',
        name: 'Mariner Professional',
        brand: 'SoleiTic',
        price: 8900,
        image: 'https://images.unsplash.com/photo-1547996160-81dfd58739c3?w=400',
        description: 'Professional diving watch with 300m water resistance, ceramic bezel, and luminescent markers. Built for underwater exploration and extreme conditions.'
      },
      {
        _id: 'fallback-3',
        name: 'Classic Elegance',
        brand: 'SoleiTic',
        price: 7500,
        image: 'https://images.unsplash.com/photo-1587836374828-4dbafa94cf0e?w=400',
        description: 'Dress watch with guilloché dial, alligator leather strap, and Roman numeral markers. Perfect for formal occasions and business settings.'
      },
      {
        _id: 'fallback-4',
        name: 'Tourbillon Master',
        brand: 'SoleiTic',
        price: 45000,
        image: 'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=400',
        description: 'Limited edition tourbillon with skeletonized dial, platinum case, and 120-hour power reserve. Only 50 pieces worldwide.'
      },
      {
        _id: 'fallback-5',
        name: 'Aviator GMT',
        brand: 'SoleiTic',
        price: 11200,
        image: 'https://images.unsplash.com/photo-1526045431048-f857369baa09?w=400',
        description: 'Dual timezone watch with luminescent markers, anti-magnetic protection, and rotating 24-hour bezel for global travelers.'
      },
      {
        _id: 'fallback-6',
        name: 'Vintage Collection 1965',
        brand: 'SoleiTic',
        price: 6800,
        image: 'https://images.unsplash.com/photo-1551816230-ef5deaed4a26?w=400',
        description: 'Reissue of our 1965 classic with updated movement, vintage styling, and domed sapphire crystal. A tribute to our heritage.'
      },
      {
        _id: 'fallback-7',
        name: 'Perpetual Calendar',
        brand: 'SoleiTic',
        price: 28500,
        image: 'https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?w=400',
        description: 'Sophisticated perpetual calendar tracking day, date, month, and moon phases until 2100. Rose gold case with enamel dial.'
      },
      {
        _id: 'fallback-8',
        name: 'Racing Chronometer',
        brand: 'SoleiTic',
        price: 9500,
        image: 'https://images.unsplash.com/photo-1544829728-e7f97e1e8e6c?w=400',
        description: 'High-precision chronometer with tachymeter scale, ceramic bezel, and column-wheel chronograph movement for motorsports enthusiasts.'
      },
      {
        _id: 'fallback-9',
        name: 'Moonphase Master',
        brand: 'SoleiTic',
        price: 13800,
        image: 'https://images.unsplash.com/photo-1532667449560-72a95c8d381b?w=400',
        description: 'Elegant moonphase complication with starry night dial, 18K white gold case, and hand-stitched crocodile leather strap.'
      },
      {
        _id: 'fallback-10',
        name: 'Skeleton Artisan',
        brand: 'SoleiTic',
        price: 32000,
        image: 'https://images.unsplash.com/photo-1557531365-e8b22d93dbd0?w=400',
        description: 'Fully skeletonized movement with hand-engraved bridges, blued screws, and micro-rotor. A true work of mechanical art.'
      },
      {
        _id: 'fallback-11',
        name: 'Explorer Automatic',
        brand: 'SoleiTic',
        price: 8200,
        image: 'https://images.unsplash.com/photo-1548175922-6f6a5c4d4b5c?w=400',
        description: 'Robust automatic watch with 200m water resistance, scratch-resistant ceramic bezel, and Super-LumiNova markers for adventurers.'
      },
      {
        _id: 'fallback-12',
        name: 'Minute Repeater',
        brand: 'SoleiTic',
        price: 125000,
        image: 'https://images.unsplash.com/photo-1557531365-e8b22d93dbd0?w=400',
        description: 'Ultra-complicated minute repeater with cathedral gongs, platinum case, and grand feu enamel dial. The pinnacle of horological artistry.'
      }
    ],
    collections: [
      {
        _id: 'fallback-col-1',
        name: 'Heritage Collection',
        description: 'Timeless designs inspired by our rich watchmaking history spanning over four decades of excellence',
        image: 'https://images.unsplash.com/photo-1518134346374-184f8d21d79e?w=500'
      },
      {
        _id: 'fallback-col-2',
        name: 'Sports Collection',
        description: 'Robust timepieces built for adventure and active lifestyles with professional-grade specifications',
        image: 'https://images.unsplash.com/photo-1547996160-81dfd58739c3?w=500'
      },
      {
        _id: 'fallback-col-3',
        name: 'Complications',
        description: 'Masterpieces featuring advanced horological complications including tourbillons and perpetual calendars',
        image: 'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=500'
      },
      {
        _id: 'fallback-col-4',
        name: 'Limited Editions',
        description: 'Exclusive numbered pieces for the discerning collector, each with unique design elements',
        image: 'https://images.unsplash.com/photo-1587836374828-4dbafa94cf0e?w=500'
      },
      {
        _id: 'fallback-col-5',
        name: 'Vintage Revival',
        description: 'Faithful recreations of iconic historical models with modern mechanical improvements',
        image: 'https://images.unsplash.com/photo-1551816230-ef5deaed4a26?w=500'
      },
      {
        _id: 'fallback-col-6',
        name: 'Artisan Series',
        description: 'Handcrafted timepieces featuring exceptional decorative techniques and rare materials',
        image: 'https://images.unsplash.com/photo-1532667449560-72a95c8d381b?w=500'
      },
      {
        _id: 'fallback-col-7',
        name: 'Contemporary Classics',
        description: 'Modern interpretations of traditional watchmaking with innovative materials and designs',
        image: 'https://images.unsplash.com/photo-1544829728-e7f97e1e8e6c?w=500'
      },
      {
        _id: 'fallback-col-8',
        name: 'Haute Horlogerie',
        description: 'The ultimate expression of watchmaking artistry with extraordinary complications and finishing',
        image: 'https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?w=500'
      }
    ],
    testimonials: [
      {
        _id: 'fallback-test-1',
        name: 'James Wilson',
        location: 'Geneva, Switzerland',
        rating: 5,
        review: 'The craftsmanship on my Heritage Chronograph is exceptional. The attention to detail rivals watches costing twice as much. The movement finishing is simply breathtaking when viewed through the sapphire case back.'
      },
      {
        _id: 'fallback-test-2',
        name: 'Sarah Chen',
        location: 'New York, USA',
        rating: 5,
        review: 'As a watch collector for 15 years, I can confidently say SoleiTic offers incredible value. The movements are beautifully finished and the complications work flawlessly. My Perpetual Calendar has been running within +1 second per day for six months.'
      },
      {
        _id: 'fallback-test-3',
        name: 'Marcus Rodriguez',
        location: 'London, UK',
        rating: 5,
        review: 'The customer service was outstanding. They helped me choose the perfect piece for my collection and the after-sales support has been impeccable. The boutique experience made me feel valued as a collector.'
      },
      {
        _id: 'fallback-test-4',
        name: 'Elena Petrov',
        location: 'Moscow, Russia',
        rating: 5,
        review: 'My Mariner Professional has been through diving expeditions and daily wear - it remains perfectly accurate and beautiful. The luminescence is incredibly bright and the ceramic bezel shows no signs of wear after two years.'
      },
      {
        _id: 'fallback-test-5',
        name: 'David Kim',
        location: 'Seoul, South Korea',
        rating: 5,
        review: 'The Tourbillon Master is a mechanical marvel. The flying tourbillon is mesmerizing to watch, and the level of hand-finishing is exceptional. This piece has become the crown jewel of my collection.'
      },
      {
        _id: 'fallback-test-6',
        name: 'Isabella Rossi',
        location: 'Milan, Italy',
        rating: 5,
        review: 'I purchased the Classic Elegance for my husband\'s anniversary, and he hasn\'t taken it off since. The guilloché dial catches light beautifully, and the alligator strap has aged gracefully. A truly timeless piece.'
      },
      {
        _id: 'fallback-test-7',
        name: 'Alexander Schmidt',
        location: 'Berlin, Germany',
        rating: 5,
        review: 'As an engineer, I appreciate the technical excellence of SoleiTic movements. My Aviator GMT has proven incredibly reliable during international travel, and the anti-magnetic protection gives me peace of mind.'
      },
      {
        _id: 'fallback-test-8',
        name: 'Sophie Laurent',
        location: 'Paris, France',
        rating: 5,
        review: 'The Vintage Collection 1965 captures the charm of classic watchmaking while offering modern reliability. The domed sapphire crystal and vintage-style hands are perfectly executed. It feels like wearing history.'
      },
      {
        _id: 'fallback-test-9',
        name: 'Michael Thompson',
        location: 'Sydney, Australia',
        rating: 5,
        review: 'After comparing several luxury brands, SoleiTic stood out for their in-house movements and exceptional value. My Racing Chronometer has become my daily companion and conversation starter.'
      },
      {
        _id: 'fallback-test-10',
        name: 'Lisa Wang',
        location: 'Shanghai, China',
        rating: 5,
        review: 'The Moonphase Master is pure poetry in motion. The starry dial and moonphase complication create a magical display. The craftsmanship exceeds watches from much older, established manufactures.'
      },
      {
        _id: 'fallback-test-11',
        name: 'Robert Johnson',
        location: 'Toronto, Canada',
        rating: 5,
        review: 'I\'ve owned my Explorer Automatic for three years now, and it has survived hiking, swimming, and daily office wear without a single issue. The durability and accuracy are remarkable for an automatic watch.'
      },
      {
        _id: 'fallback-test-12',
        name: 'Maria Gonzalez',
        location: 'Madrid, Spain',
        rating: 5,
        review: 'The Skeleton Artisan is a window into mechanical perfection. Watching the balance wheel oscillate through the skeletonized dial is meditative. The hand-engraving on the bridges is museum-quality.'
      }
    ],
    newsArticles: [
      {
        _id: 'fallback-news-1',
        title: 'SoleiTic Introduces Revolutionary New In-House Movement with 10-Day Power Reserve',
        category: 'Innovation',
        image: 'https://images.unsplash.com/photo-1518134346374-184f8d21d79e?w=400',
        excerpt: 'Our latest proprietary caliber features groundbreaking silicon technology, enhanced shock resistance, and an impressive 240-hour power reserve while maintaining COSC chronometer precision.'
      },
      {
        _id: 'fallback-news-2',
        title: 'Limited Edition Tourbillon Sells Out in Record 3 Hours',
        category: 'Collections',
        image: 'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=400',
        excerpt: 'The exclusive 25-piece limited edition featuring a flying tourbillon and grand feu enamel dial was completely reserved within 3 hours of announcement, setting a new brand record for collector demand.'
      },
      {
        _id: 'fallback-news-3',
        title: 'Sustainable Luxury: SoleiTic Leads Industry in Environmental Initiatives',
        category: 'Sustainability',
        image: 'https://images.unsplash.com/photo-1547996160-81dfd58739c3?w=400',
        excerpt: 'How SoleiTic is pioneering environmentally responsible manufacturing with solar-powered facilities, recycled precious metals, and ocean conservation partnerships while maintaining luxury standards.'
      },
      {
        _id: 'fallback-news-4',
        title: 'New Heritage Collection Pays Tribute to 45 Years of Watchmaking Excellence',
        category: 'Heritage',
        image: 'https://images.unsplash.com/photo-1551816230-ef5deaed4a26?w=400',
        excerpt: 'Celebrating four decades of horological innovation, the expanded Heritage Collection features reimagined classics with modern movements and vintage-inspired design elements.'
      },
      {
        _id: 'fallback-news-5',
        title: 'SoleiTic Wins Prestigious Geneva Watchmaking Grand Prix 2024',
        category: 'Awards',
        image: 'https://images.unsplash.com/photo-1532667449560-72a95c8d381b?w=400',
        excerpt: 'Our Minute Repeater collection has been honored with the top prize at the Geneva Watchmaking Grand Prix, recognizing exceptional technical achievement and artistic craftsmanship.'
      },
      {
        _id: 'fallback-news-6',
        title: 'Exclusive Partnership with Ocean Conservation Foundation Announced',
        category: 'Partnerships',
        image: 'https://images.unsplash.com/photo-1548175922-6f6a5c4d4b5c?w=400',
        excerpt: 'SoleiTic partners with leading marine conservation organization, dedicating a portion of Mariner Professional sales to protect endangered marine ecosystems worldwide.'
      },
      {
        _id: 'fallback-news-7',
        title: 'Artisan Workshop Expansion Triples Capacity for Hand-Finishing',
        category: 'Manufacturing',
        image: 'https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?w=400',
        excerpt: 'Our newly expanded artisan workshop in Switzerland now accommodates 45 master craftsmen specializing in traditional techniques like guilloché, enameling, and hand-engraving.'
      },
      {
        _id: 'fallback-news-8',
        title: 'Digital Innovation: New App Enhances Collector Experience',
        category: 'Technology',
        image: 'https://images.unsplash.com/photo-1544829728-e7f97e1e8e6c?w=400',
        excerpt: 'The updated SoleiTic companion app now features augmented reality try-ons, service history tracking, and digital authentication for enhanced ownership experience.'
      },
      {
        _id: 'fallback-news-9',
        title: 'Historical Archive Discovery Reveals Lost 1978 Prototype',
        category: 'History',
        image: 'https://images.unsplash.com/photo-1557531365-e8b22d93dbd0?w=400',
        excerpt: 'Recently uncovered archives reveal never-before-seen prototype designs from our founding year, inspiring new limited edition pieces for dedicated collectors.'
      },
      {
        _id: 'fallback-news-10',
        title: 'Master Watchmaker Program Graduates 12 New Artisans',
        category: 'Education',
        image: 'https://images.unsplash.com/photo-1587836374828-4dbafa94cf0e?w=400',
        excerpt: 'Our intensive 5-year apprenticeship program celebrates its latest graduates, ensuring the continuation of traditional Swiss watchmaking skills for future generations.'
      },
      {
        _id: 'fallback-news-11',
        title: 'SoleiTic Opens Flagship Boutique in Dubai Design District',
        category: 'Retail',
        image: 'https://images.unsplash.com/photo-1523170335258-f5ed11844a49?w=400',
        excerpt: 'The new 5,000 square foot boutique features exclusive timepieces, private consultation rooms, and an horological museum showcasing our most significant creations.'
      },
      {
        _id: 'fallback-news-12',
        title: 'Research Breakthrough: New Anti-Magnetic Technology',
        category: 'Innovation',
        image: 'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=400',
        excerpt: 'Our R&D team develops revolutionary anti-magnetic shield protecting movements from fields up to 15,000 gauss, far exceeding industry standards for magnetic resistance.'
      }
    ],
    craftsmanship: [
      {
        _id: 'craft-1',
        title: 'Movement Manufacturing',
        description: 'Each movement component is manufactured in-house to tolerances of 1/1000mm using advanced CNC technology and traditional techniques.',
        icon: '⚙️'
      },
      {
        _id: 'craft-2',
        title: 'Hand-Finishing',
        description: 'Master artisans spend up to 40 hours on decorative finishes including Côtes de Genève, perlage, and anglage using techniques unchanged for centuries.',
        icon: '🎨'
      },
      {
        _id: 'craft-3',
        title: 'Quality Control',
        description: 'Every watch undergoes 47 rigorous tests including timing accuracy in 5 positions, water resistance, shock resistance, and magnetic field exposure.',
        icon: '🔬'
      },
      {
        _id: 'craft-4',
        title: 'Material Science',
        description: 'We use 904L stainless steel, 18K gold alloys, platinum, and advanced ceramics selected for durability, corrosion resistance, and aesthetic appeal.',
        icon: '💎'
      }
    ],
    brandStory: {
      title: 'The SoleiTic Legacy',
      content: 'Founded in 1978 in the heart of Swiss watchmaking country, SoleiTic has dedicated over four decades to pushing the boundaries of mechanical watchmaking while honoring traditional craftsmanship.',
      image: 'https://images.unsplash.com/photo-1523170335258-f5ed11844a49?w=800'
    }
  };

  useEffect(() => {
    fetchAllData();
  }, []);



  const fetchAllData = async () => {
    try {
      const [hero, watches, cols, tests, brand, craft, news] = await Promise.all([
        axios.get('/api/homepage/hero').catch(() => ({ data: fallbackData.hero })),
        axios.get('/api/homepage/featured-watches').catch(() => ({ data: fallbackData.featuredWatches })),
        axios.get('/api/homepage/collections').catch(() => ({ data: fallbackData.collections })),
        axios.get('/api/homepage/testimonials').catch(() => ({ data: fallbackData.testimonials })),
        axios.get('/api/homepage/brand-story').catch(() => ({ data: fallbackData.brandStory })),
        axios.get('/api/homepage/craftsmanship').catch(() => ({ data: fallbackData.craftsmanship })),
        axios.get('/api/homepage/news').catch(() => ({ data: fallbackData.newsArticles }))
      ]);

      // Ensure we always set arrays, never undefined or null
      setHeroData(hero.data || fallbackData.hero);
      setFeaturedWatches(Array.isArray(watches.data) ? watches.data : fallbackData.featuredWatches);
      setCollections(Array.isArray(cols.data) ? cols.data : fallbackData.collections);
      setTestimonials(Array.isArray(tests.data) ? tests.data : fallbackData.testimonials);
      setBrandStory(brand.data || fallbackData.brandStory);
      setCraftsmanship(Array.isArray(craft.data) ? craft.data : fallbackData.craftsmanship);
      setNewsArticles(Array.isArray(news.data) ? news.data : fallbackData.newsArticles);
      setDataLoaded(true);
    } catch (error) {
      console.error('Error fetching data:', error);
      // Load complete fallback data
      setHeroData(fallbackData.hero);
      setFeaturedWatches(fallbackData.featuredWatches);
      setCollections(fallbackData.collections);
      setTestimonials(fallbackData.testimonials);
      setBrandStory(fallbackData.brandStory);
      setCraftsmanship(fallbackData.craftsmanship);
      setNewsArticles(fallbackData.newsArticles);
      setDataLoaded(true);
    }
  };

  const handleAddItem = async (type) => {
    const { value: formValues } = await Swal.fire({
      title: `Add New ${type}`,
      html: getFormHTML(type),
      focusConfirm: false,
      showCancelButton: true,
      confirmButtonText: 'Add',
      background: isDarkMode ? '#1a1a1a' : '#ffffff',
      color: isDarkMode ? '#ffffff' : '#000000',
      preConfirm: () => getFormData(type)
    });

    if (formValues) {
      try {
        await axios.post(`/api/homepage/${type}`, formValues);
        Swal.fire('Success!', 'Item added successfully', 'success');
        fetchAllData();
      } catch (error) {
        Swal.fire('Error!', 'Failed to add item', 'error');
      }
    }
  };

  const handleEditItem = async (type, item) => {
    const { value: formValues } = await Swal.fire({
      title: `Edit ${type}`,
      html: getFormHTML(type, item),
      focusConfirm: false,
      showCancelButton: true,
      confirmButtonText: 'Update',
      background: isDarkMode ? '#1a1a1a' : '#ffffff',
      color: isDarkMode ? '#ffffff' : '#000000',
      preConfirm: () => getFormData(type)
    });

    if (formValues) {
      try {
        await axios.put(`/api/homepage/${type}/${item._id}`, formValues);
        Swal.fire('Success!', 'Item updated successfully', 'success');
        fetchAllData();
      } catch (error) {
        Swal.fire('Error!', 'Failed to update item', 'error');
      }
    }
  };

  const handleDeleteItem = async (type, id) => {
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, delete it!',
      background: isDarkMode ? '#1a1a1a' : '#ffffff',
      color: isDarkMode ? '#ffffff' : '#000000'
    });

    if (result.isConfirmed) {
      try {
        await axios.delete(`/api/homepage/${type}/${id}`);
        Swal.fire('Deleted!', 'Item has been deleted.', 'success');
        fetchAllData();
      } catch (error) {
        Swal.fire('Error!', 'Failed to delete item', 'error');
      }
    }
  };

  const getFormHTML = (type, data = {}) => {
    switch (type) {
      case 'featured-watches':
        return `
          <input id="swal-name" class="swal2-input" placeholder="Watch Name" value="${data.name || ''}">
          <input id="swal-brand" class="swal2-input" placeholder="Brand" value="${data.brand || ''}">
          <input id="swal-price" class="swal2-input" placeholder="Price" value="${data.price || ''}">
          <input id="swal-image" class="swal2-input" placeholder="Image URL" value="${data.image || ''}">
          <textarea id="swal-description" class="swal2-textarea" placeholder="Description">${data.description || ''}</textarea>
        `;
      case 'testimonials':
        return `
          <input id="swal-name" class="swal2-input" placeholder="Customer Name" value="${data.name || ''}">
          <input id="swal-location" class="swal2-input" placeholder="Location" value="${data.location || ''}">
          <input id="swal-rating" class="swal2-input" placeholder="Rating (1-5)" value="${data.rating || '5'}">
          <textarea id="swal-review" class="swal2-textarea" placeholder="Review">${data.review || ''}</textarea>
        `;
      case 'news':
        return `
          <input id="swal-title" class="swal2-input" placeholder="Title" value="${data.title || ''}">
          <input id="swal-category" class="swal2-input" placeholder="Category" value="${data.category || ''}">
          <input id="swal-image" class="swal2-input" placeholder="Image URL" value="${data.image || ''}">
          <textarea id="swal-excerpt" class="swal2-textarea" placeholder="Excerpt">${data.excerpt || ''}</textarea>
        `;
      default:
        return '';
    }
  };

  const getFormData = (type) => {
    switch (type) {
      case 'featured-watches':
        return {
          name: document.getElementById('swal-name').value,
          brand: document.getElementById('swal-brand').value,
          price: document.getElementById('swal-price').value,
          image: document.getElementById('swal-image').value,
          description: document.getElementById('swal-description').value
        };
      case 'testimonials':
        return {
          name: document.getElementById('swal-name').value,
          location: document.getElementById('swal-location').value,
          rating: document.getElementById('swal-rating').value,
          review: document.getElementById('swal-review').value
        };
      case 'news':
        return {
          title: document.getElementById('swal-title').value,
          category: document.getElementById('swal-category').value,
          image: document.getElementById('swal-image').value,
          excerpt: document.getElementById('swal-excerpt').value
        };
      default:
        return {};
    }
  };

  // Show loading state while data is being fetched
  if (!dataLoaded) {
    return (
      <div className={`SoleiTic-Homepage-loading ${isDarkMode ? 'dark' : 'light'}`}>
        <div className="SoleiTic-Homepage-loading-spinner"></div>
        <p>Loading SoleiTic Collection...</p>
      </div>
    );
  }

  return (
    <div className={`SoleiTic-Homepage-container ${isDarkMode ? 'dark' : 'light'}`}>
      {/* Hero Section */}
      <section className="SoleiTic-Homepage-hero-section" ref={heroRef}>
        <div className="SoleiTic-Homepage-hero-overlay"></div>
        <div className="SoleiTic-Homepage-hero-content">
          <h1 className="SoleiTic-Homepage-hero-title">
            {heroData?.title || 'Timeless Elegance, Crafted to Perfection'}
          </h1>
          <p className="SoleiTic-Homepage-hero-subtitle">
            {heroData?.subtitle || 'Discover luxury timepieces that define sophistication and precision'}
          </p>
          <div className="SoleiTic-Homepage-hero-buttons">
            <button className="SoleiTic-Homepage-btn-primary">Explore Collection</button>
            <button className="SoleiTic-Homepage-btn-secondary">Watch Video</button>
          </div>
        </div>
        <div className="SoleiTic-Homepage-hero-decoration">
          <div className="SoleiTic-Homepage-circle-decoration"></div>
          <div className="SoleiTic-Homepage-circle-decoration"></div>
          <div className="SoleiTic-Homepage-circle-decoration"></div>
        </div>
      </section>

      {/* Featured Watches Section */}
      <section className="SoleiTic-Homepage-featured-section">
        <div className="SoleiTic-Homepage-section-header">
          <h2 className="SoleiTic-Homepage-section-title">Featured Timepieces</h2>
          <p className="SoleiTic-Homepage-section-description">
            Handpicked selections from our prestigious collection of luxury watches
          </p>

        </div>
        <div className="SoleiTic-Homepage-watches-grid" ref={watchesRef}>
          {Array.isArray(featuredWatches) && featuredWatches.map((watch, index) => (
            <div key={watch._id} className="SoleiTic-Homepage-watch-card">
              <div className="SoleiTic-Homepage-watch-image-wrapper">
                <img
                  src={watch.image}
                  alt={watch.name}
                  className="SoleiTic-Homepage-watch-image"
                  loading="lazy"
                  onError={(e) => {
                    e.target.src = 'https://images.unsplash.com/photo-1523170335258-f5ed11844a49?w=400';
                  }}
                />
                <div className="SoleiTic-Homepage-watch-overlay">
                  <button className="SoleiTic-Homepage-quick-view-btn">Quick View</button>
                </div>
              </div>
              <div className="SoleiTic-Homepage-watch-info">
                <span className="SoleiTic-Homepage-watch-brand">{watch.brand}</span>
                <h3 className="SoleiTic-Homepage-watch-name">{watch.name}</h3>
                <p className="SoleiTic-Homepage-watch-description">{watch.description}</p>
                <div className="SoleiTic-Homepage-watch-footer">
                  <span className="SoleiTic-Homepage-watch-price">${watch.price?.toLocaleString()}</span>
                  <button className="SoleiTic-Homepage-add-cart-btn">Add to Cart</button>
                </div>
                {isAdmin && (
                  <div className="SoleiTic-Homepage-admin-actions">
                    <button
                      className="SoleiTic-Homepage-edit-btn"
                      onClick={() => handleEditItem('featured-watches', watch)}
                    >
                      Edit
                    </button>
                    <button
                      className="SoleiTic-Homepage-delete-btn"
                      onClick={() => handleDeleteItem('featured-watches', watch._id)}
                    >
                      Delete
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Brand Statistics */}
      <section className="SoleiTic-Homepage-stats-section">
        <div className="SoleiTic-Homepage-stats-grid">
          <div className="SoleiTic-Homepage-stat-card">
            <h3 className="SoleiTic-Homepage-stat-number" data-target="45">0</h3>
            <p className="SoleiTic-Homepage-stat-label">Years of Excellence</p>
          </div>
          <div className="SoleiTic-Homepage-stat-card">
            <h3 className="SoleiTic-Homepage-stat-number" data-target="150">0</h3>
            <p className="SoleiTic-Homepage-stat-label">Master Craftsmen</p>
          </div>
          <div className="SoleiTic-Homepage-stat-card">
            <h3 className="SoleiTic-Homepage-stat-number" data-target="50000">0</h3>
            <p className="SoleiTic-Homepage-stat-label">Satisfied Customers</p>
          </div>
          <div className="SoleiTic-Homepage-stat-card">
            <h3 className="SoleiTic-Homepage-stat-number" data-target="500">0</h3>
            <p className="SoleiTic-Homepage-stat-label">Exclusive Models</p>
          </div>
        </div>
      </section>

      {/* Collections Section */}
      <section className="SoleiTic-Homepage-collections-section">
        <h2 className="SoleiTic-Homepage-section-title">Explore Our Collections</h2>
        <p className="SoleiTic-Homepage-section-description">
          Each collection tells a unique story of innovation, heritage, and impeccable design
        </p>
        <div className="SoleiTic-Homepage-collections-grid">
          {Array.isArray(collections) && collections.map((collection, index) => (
            <div key={collection._id} className="SoleiTic-Homepage-collection-card">
              <img
                src={collection.image}
                alt={collection.name}
                className="SoleiTic-Homepage-collection-image"
                loading="lazy"
                onError={(e) => {
                  e.target.src = 'https://images.unsplash.com/photo-1518134346374-184f8d21d79e?w=500';
                }}
              />
              <div className="SoleiTic-Homepage-collection-overlay">
                <h3 className="SoleiTic-Homepage-collection-name">{collection.name}</h3>
                <p className="SoleiTic-Homepage-collection-description">{collection.description}</p>
                <button className="SoleiTic-Homepage-explore-btn">Explore Collection</button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Brand Story Section - SEO Optimized */}
      <section className="SoleiTic-Homepage-story-section">
        <div className="SoleiTic-Homepage-story-content">
          <div className="SoleiTic-Homepage-story-text">
            <h2 className="SoleiTic-Homepage-story-title">The SoleiTic Legacy</h2>
            <p className="SoleiTic-Homepage-story-paragraph">
              Since 1978, SoleiTic has been at the forefront of luxury watchmaking, combining
              Swiss precision with innovative design. Our commitment to excellence has made us
              one of the most prestigious watch manufacturers in the world.
            </p>
            <p className="SoleiTic-Homepage-story-paragraph">
              Every SoleiTic timepiece represents hundreds of hours of meticulous craftsmanship,
              using only the finest materials sourced from around the globe. Our master watchmakers
              bring decades of experience to create mechanical movements that are both technically
              superior and aesthetically stunning.
            </p>
            <p className="SoleiTic-Homepage-story-paragraph">
              From our iconic automatic chronographs to our limited edition tourbillon pieces,
              each watch embodies our philosophy: time is not just measured, it is celebrated.
              We believe in creating heirlooms that transcend generations, carrying stories and
              memories forward through time.
            </p>
            <button className="SoleiTic-Homepage-learn-more-btn">Discover Our Heritage</button>
          </div>
          <div className="SoleiTic-Homepage-story-image-container">
            <div className="SoleiTic-Homepage-story-image-wrapper">
              <img
                src={brandStory?.image || 'https://images.unsplash.com/photo-1523170335258-f5ed11844a49?w=800'}
                alt="SoleiTic Watchmaking Heritage"
                className="SoleiTic-Homepage-story-image"
                loading="lazy"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Craftsmanship Details - SEO Content */}
      <section className="SoleiTic-Homepage-craftsmanship-section">
        <h2 className="SoleiTic-Homepage-section-title">Unparalleled Craftsmanship</h2>
        <p className="SoleiTic-Homepage-section-description">
          The art of precision engineering meets centuries-old traditions
        </p>
        <div className="SoleiTic-Homepage-craftsmanship-grid">
          <div className="SoleiTic-Homepage-craft-card">
            <div className="SoleiTic-Homepage-craft-icon">⚙️</div>
            <h3 className="SoleiTic-Homepage-craft-title">Swiss Movement</h3>
            <p className="SoleiTic-Homepage-craft-text">
              Our in-house calibers are developed and manufactured in Switzerland, featuring
              complications such as perpetual calendars, minute repeaters, and tourbillons.
              Each movement undergoes rigorous testing to ensure accuracy within COSC chronometer
              standards, with many exceeding these benchmarks through our proprietary refinement process.
            </p>
          </div>
          <div className="SoleiTic-Homepage-craft-card">
            <div className="SoleiTic-Homepage-craft-icon">💎</div>
            <h3 className="SoleiTic-Homepage-craft-title">Premium Materials</h3>
            <p className="SoleiTic-Homepage-craft-text">
              We use only the finest materials: 904L stainless steel, 18K gold, platinum,
              and ethically sourced diamonds. Our sapphire crystals are triple-coated with
              anti-reflective treatment, providing exceptional clarity and scratch resistance.
              Exotic materials like meteorite dials and forged carbon add unique character to
              our limited editions.
            </p>
          </div>
          <div className="SoleiTic-Homepage-craft-card">
            <div className="SoleiTic-Homepage-craft-icon">🎨</div>
            <h3 className="SoleiTic-Homepage-craft-title">Artisan Finishing</h3>
            <p className="SoleiTic-Homepage-craft-text">
              Every component receives hand-finishing by our master artisans. From Côtes de Genève
              decoration on bridges to polished bevels and perlage on base plates, these traditional
              techniques have been passed down through generations. Our dial makers use ancient
              methods like guilloché and grand feu enamel to create stunning visual effects.
            </p>
          </div>
          <div className="SoleiTic-Homepage-craft-card">
            <div className="SoleiTic-Homepage-craft-icon">🔬</div>
            <h3 className="SoleiTic-Homepage-craft-title">Quality Assurance</h3>
            <p className="SoleiTic-Homepage-craft-text">
              Before leaving our manufacture, each watch passes through 47 quality control checkpoints.
              We test water resistance, shock resistance, magnetic resistance, and timing accuracy
              in multiple positions and temperatures. Our 5-year international warranty reflects
              our confidence in the exceptional quality and durability of every SoleiTic timepiece.
            </p>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="SoleiTic-Homepage-testimonials-section">
        <h2 className="SoleiTic-Homepage-section-title">What Our Collectors Say</h2>
        <p className="SoleiTic-Homepage-section-description">
          Trusted by watch enthusiasts and collectors worldwide
        </p>

        <div className="SoleiTic-Homepage-testimonials-grid">
          {Array.isArray(testimonials) && testimonials.map((testimonial, index) => (
            <div key={testimonial._id} className="SoleiTic-Homepage-testimonial-card">
              <div className="SoleiTic-Homepage-testimonial-stars">
                {'★'.repeat(testimonial.rating || 5)}
              </div>
              <p className="SoleiTic-Homepage-testimonial-text">"{testimonial.review}"</p>
              <div className="SoleiTic-Homepage-testimonial-author">
                <h4 className="SoleiTic-Homepage-testimonial-name">{testimonial.name}</h4>
                <p className="SoleiTic-Homepage-testimonial-location">{testimonial.location}</p>
              </div>
              {isAdmin && (
                <div className="SoleiTic-Homepage-admin-actions">
                  <button
                    className="SoleiTic-Homepage-edit-btn"
                    onClick={() => handleEditItem('testimonials', testimonial)}
                  >
                    Edit
                  </button>
                  <button
                    className="SoleiTic-Homepage-delete-btn"
                    onClick={() => handleDeleteItem('testimonials', testimonial._id)}
                  >
                    Delete
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Innovation & Technology - SEO Content */}
      <section className="SoleiTic-Homepage-innovation-section">
        <div className="SoleiTic-Homepage-innovation-content">
          <h2 className="SoleiTic-Homepage-section-title">Innovation Meets Tradition</h2>
          <div className="SoleiTic-Homepage-innovation-grid">
            <div className="SoleiTic-Homepage-innovation-item">
              <h3 className="SoleiTic-Homepage-innovation-subtitle">Advanced Complications</h3>
              <p className="SoleiTic-Homepage-innovation-text">
                Our research and development team continuously pushes the boundaries of horological
                innovation. Recent breakthroughs include our proprietary anti-magnetic silicon
                escapement, extended 10-day power reserve movements, and ultra-thin automatic
                calibers measuring just 2.8mm in height. These technical achievements maintain
                SoleiTic's position as an industry leader in watchmaking innovation.
              </p>
            </div>
            <div className="SoleiTic-Homepage-innovation-item">
              <h3 className="SoleiTic-Homepage-innovation-subtitle">Sustainable Luxury</h3>
              <p className="SoleiTic-Homepage-innovation-text">
                Environmental responsibility is central to our manufacturing process. We've
                implemented solar panels at our Swiss facilities, use recycled gold in production,
                and partner with organizations dedicated to ocean conservation. Our packaging
                utilizes FSC-certified materials, and we've eliminated single-use plastics from
                all operations while maintaining the luxury presentation our customers expect.
              </p>
            </div>
            <div className="SoleiTic-Homepage-innovation-item">
              <h3 className="SoleiTic-Homepage-innovation-subtitle">Digital Integration</h3>
              <p className="SoleiTic-Homepage-innovation-text">
                While respecting traditional mechanical watchmaking, we've embraced technology
                where it enhances the customer experience. Our mobile app provides authenticity
                verification, service history tracking, and AR visualization for virtual try-ons.
                Each watch includes NFC authentication, ensuring your investment's provenance and
                protecting against counterfeiting in the secondary market.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Latest News & Articles - SEO Content */}
      <section className="SoleiTic-Homepage-news-section">
        <h2 className="SoleiTic-Homepage-section-title">Latest from SoleiTic</h2>
        <p className="SoleiTic-Homepage-section-description">
          Stay updated with our latest releases, events, and horological insights
        </p>

        <div className="SoleiTic-Homepage-news-grid">
          {Array.isArray(newsArticles) && newsArticles.map((article, index) => (
            <article key={article._id} className="SoleiTic-Homepage-news-card">
              <img
                src={article.image}
                alt={article.title}
                className="SoleiTic-Homepage-news-image"
                loading="lazy"
                onError={(e) => {
                  e.target.src = 'https://images.unsplash.com/photo-1518134346374-184f8d21d79e?w=400';
                }}
              />
              <div className="SoleiTic-Homepage-news-content">
                <span className="SoleiTic-Homepage-news-category">{article.category}</span>
                <h3 className="SoleiTic-Homepage-news-title">{article.title}</h3>
                <p className="SoleiTic-Homepage-news-excerpt">{article.excerpt}</p>
                <button className="SoleiTic-Homepage-read-more-btn">Read More →</button>
                {isAdmin && (
                  <div className="SoleiTic-Homepage-admin-actions">
                    <button
                      className="SoleiTic-Homepage-edit-btn"
                      onClick={() => handleEditItem('news', article)}
                    >
                      Edit
                    </button>
                    <button
                      className="SoleiTic-Homepage-delete-btn"
                      onClick={() => handleDeleteItem('news', article._id)}
                    >
                      Delete
                    </button>
                  </div>
                )}
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* FAQ Section - SEO Optimized */}
      <section className="SoleiTic-Homepage-faq-section">
        <h2 className="SoleiTic-Homepage-section-title">Frequently Asked Questions</h2>
        <div className="SoleiTic-Homepage-faq-container">
          <div className="SoleiTic-Homepage-faq-item">
            <h3 className="SoleiTic-Homepage-faq-question">What makes SoleiTic watches unique?</h3>
            <p className="SoleiTic-Homepage-faq-answer">
              SoleiTic watches combine Swiss precision engineering with innovative design philosophy.
              Each timepiece features in-house manufactured movements, premium materials including
              904L steel and 18K gold, and undergoes 47 quality checkpoints. Our master craftsmen
              apply traditional finishing techniques passed down through generations, ensuring every
              watch is both a precision instrument and a work of art.
            </p>
          </div>
          <div className="SoleiTic-Homepage-faq-item">
            <h3 className="SoleiTic-Homepage-faq-question">How often should I service my SoleiTic watch?</h3>
            <p className="SoleiTic-Homepage-faq-answer">
              We recommend servicing your SoleiTic timepiece every 5-7 years to maintain optimal
              performance. However, if you notice any irregularities in timekeeping, water resistance
              issues, or difficulty winding, contact our authorized service centers immediately. All
              servicing is performed by certified watchmakers using genuine SoleiTic parts, and your
              warranty covers manufacturing defects for 5 years from purchase.
            </p>
          </div>
          <div className="SoleiTic-Homepage-faq-item">
            <h3 className="SoleiTic-Homepage-faq-question">Are SoleiTic watches a good investment?</h3>
            <p className="SoleiTic-Homepage-faq-answer">
              While we create timepieces primarily as expressions of fine watchmaking rather than
              investment vehicles, many SoleiTic models, particularly limited editions and
              complicated pieces, have shown strong value retention and appreciation in the
              secondary market. Factors affecting value include rarity, condition, provenance,
              and market demand. We recommend purchasing SoleiTic watches for their craftsmanship
              and emotional value first.
            </p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="SoleiTic-Homepage-cta-section">
        <div className="SoleiTic-Homepage-cta-content">
          <h2 className="SoleiTic-Homepage-cta-title">Begin Your Journey</h2>
          <p className="SoleiTic-Homepage-cta-text">
            Visit our boutiques worldwide or schedule a private consultation to experience
            SoleiTic craftsmanship firsthand
          </p>
          <div className="SoleiTic-Homepage-cta-buttons">
            <button className="SoleiTic-Homepage-btn-primary">Find a Boutique</button>
            <button className="SoleiTic-Homepage-btn-secondary">Schedule Consultation</button>
          </div>
        </div>
      </section>

      {/* AuthNester Integration Section */}
      <section className="SoleiTic-Homepage-authnester-section">
        <div className="SoleiTic-Homepage-authnester-content">
          <div className="SoleiTic-Homepage-authnester-text">
            <h2 className="SoleiTic-Homepage-authnester-title">
              Secure Authentication System
            </h2>
            <p className="SoleiTic-Homepage-authnester-description">
              Powered by <strong>AuthNester</strong> - A robust MERN stack authentication solution
              that ensures your data and account security with enterprise-grade protection.
            </p>
            <div className="SoleiTic-Homepage-authnester-features">
              <div className="SoleiTic-Homepage-authnester-feature">
                <span className="SoleiTic-Homepage-authnester-feature-icon">🔒</span>
                <span>Secure Login & Registration</span>
              </div>
              <div className="SoleiTic-Homepage-authnester-feature">
                <span className="SoleiTic-Homepage-authnester-feature-icon">🛡️</span>
                <span>JWT Token Protection</span>
              </div>
              <div className="SoleiTic-Homepage-authnester-feature">
                <span className="SoleiTic-Homepage-authnester-feature-icon">🔑</span>
                <span>Password Encryption</span>
              </div>
              <div className="SoleiTic-Homepage-authnester-feature">
                <span className="SoleiTic-Homepage-authnester-feature-icon">⚡</span>
                <span>Fast & Reliable</span>
              </div>
            </div>
            <p className="SoleiTic-Homepage-authnester-note">
              Our authentication system is built on modern security practices to protect
              your personal information and provide a seamless user experience.
            </p>
            <a
              href="https://authnester.netlify.app/"
              target="_blank"
              rel="noopener noreferrer"
              className="SoleiTic-Homepage-authnester-btn"
            >
              Explore AuthNester System
            </a>
          </div>
          <div className="SoleiTic-Homepage-authnester-visual">
            <div className="SoleiTic-Homepage-authnester-card">
              <div className="SoleiTic-Homepage-authnester-card-header">
                <div className="SoleiTic-Homepage-authnester-card-dots">
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
              </div>
              <div className="SoleiTic-Homepage-authnester-card-content">
                <h4>AuthNester</h4>
                <p>MERN Stack Authentication</p>
                <div className="SoleiTic-Homepage-authnester-card-features">
                  <span>🔐 Secure</span>
                  <span>🚀 Fast</span>
                  <span>💾 MongoDB</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default SoleiTicHomepage;