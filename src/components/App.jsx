import  { useState, useEffect } from "react";
import Status from "services/Status";
import Searchbar from "./Searchbar/Searchbar";
import ImageGallery from "./ImageGallery/ImageGallery";
import Button from "./Button/Button";
import Loader from "./Loader/Loader";
import Modal from "./Modal/Modal";
import { getPixabayImages } from "services/pixabayAPI";
import { ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import css from "./App.module.css"

export default function App() {
  const [status, setStatus] = useState(Status.IDLE);
  const [images, setImages] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [query, setQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [error, setError] = useState(null);
  const [largeImageURL, setLargeImageURL] = useState('');
  const [largeImageALT, setLargeImageALT] = useState('');
  const [totalImages, setTotalImages] = useState(0);

  useEffect(() => {
    if (query === '') {
      return
    }
    
    setStatus(Status.PENDING);

    setTimeout(() => {
      getImagesFromApi(); 
    }, 1500)
    
  }, [query]);

  const getImagesFromApi = async () => {    
    try {
      const { hits, totalHits } = await getPixabayImages(query, currentPage);
      
      setImages(prevImages => [...prevImages, ...hits]);
      setCurrentPage(prevCurrentPage => prevCurrentPage + 1);
      setStatus(Status.RESOLVED);
      setTotalImages(hits.length) 
      
      if (totalHits === 0) {
        setStatus(Status.REJECTED);
      }

    } catch (error) {
      console.log(error) 
      setError(error)
    }
  }

  const handleSearchBarSubmit = query => {
    setImages([]);
    setQuery(query);
    setCurrentPage(1);
    setError(null);
  }

   const toggleModal = () => {
    setIsModalOpen(prevIsModalOpen => !prevIsModalOpen)
  }

  const handleImageClick = (url, alt) => {
    setLargeImageURL(url);
    setLargeImageALT(alt)
    toggleModal();
  }


  return (
    <div className={css.app}>
      <Searchbar onSubmit={handleSearchBarSubmit} />
      {status === 'idle' && <h2 className={css.title}>Gallery is empty</h2>}
      {status === 'pending' && <Loader />}
      {status === 'rejected' && <h2 className={css.title}>Sorry, there is nothing that matches your search. Try something else.</h2>}
      {status === 'resolved' && (
        <>
          <ImageGallery images={images} onOpenModal={handleImageClick} />
          {totalImages >= 12 && (<Button onNextPage={getImagesFromApi}/>)  }
          {isModalOpen && (
            <Modal
              src={largeImageURL}
              alt={largeImageALT}
              onModalClose={toggleModal}
            />)}
        </>
      )}      
      <ToastContainer autoClose={1000} theme="colored" />      
    </div>
  )
}