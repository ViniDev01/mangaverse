import React from 'react';
function Filter({ activeFilter, onFilterChange }) {


    return(
        <section className="container-filter">
      <div className="center">
        <div className="list-filter">
          <button 
          onClick={() => onFilterChange('all')}
          className={`btn-filter ${activeFilter === 'all' ? 'active' : ''}`}
          >
            todos
          </button>

          <button 
          onClick={() => onFilterChange('mangas')}
          className={`btn-filter ${activeFilter === 'mangas' ? 'active' : ''}`}
          >
            mangas
          </button>

          <button 
          onClick={() => onFilterChange('manhwas')}
          className={`btn-filter ${activeFilter === 'manhwas' ? 'active' : ''}`}
          >
            manhwas
          </button>

          <button 
          onClick={() => onFilterChange('manhuas')}
          className={`btn-filter ${activeFilter === 'manhuas' ? 'active' : ''}`}
          >
            manhuas
          </button>
          
          <button 
          onClick={() => onFilterChange('novels')}
          className={`btn-filter ${activeFilter === 'novels' ? 'active' : ''}`}	
          >
            novels
          </button>
        </div>
      </div>
    </section>
    )
}

export default Filter;