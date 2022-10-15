import { useState } from "react";
import { toast } from "react-toastify";
import PropTypes from 'prop-types';
import { BsSearch } from 'react-icons/bs';
import css from './Searchbar.module.css';

export default function Searchbar({ onSubmit }) {
    const [query, setQuery] = useState('');

    const handleChange = event => {
        setQuery(event.currentTarget.value);
    }

    const handleSumbit = event => {        
        event.preventDefault();
         
        if (query.trim() === '') {
            toast.error('Please fill out the search field')
            return
        }

        onSubmit(query)

        setQuery('');
    }

    return (
        <header className={css.searchbar}>
            <form className={css.searchForm} onSubmit={handleSumbit}>
                <button type="submit" className={css["searchForm-button"]}>
                    <BsSearch className={css.icon} />
                </button>

                <input
                    className={css["searchForm-input"]}
                    type="text"
                    autoComplete="off"
                    autoFocus
                    placeholder="Search images and photos"
                    value={query}
                    onChange={handleChange}
                />
            </form>
        </header>
    )
}

Searchbar.propTypes = {
    onSubmit: PropTypes.func.isRequired,
}