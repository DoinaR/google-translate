import { useEffect, useState } from 'react'

import Arrows from './components/Arrows'
import Button from './components/Button'
import Modal from './components/Modal'
import TextBox from './components/TextBox'

import axios from 'axios'

const App = () => {
  const [showModal, setShowModal] = useState(false)
  const [inputLanguage, setInputLanguage] = useState('English')
  const [outputLanguage, setOutputLanguage] = useState('Romanian')
  const [languages, setLanguages] = useState(null)
  const [textToTranslate, setTextToTranslate] = useState('')
  const [translatedText, setTranslatedText] = useState('')

  const getLanguages = () => {
    const options = {
      method: 'GET',
      url: 'https://google-translate20.p.rapidapi.com/languages',
      headers: {
        'X-RapidAPI-Key': process.env.RAPID_API_KEY,
        'X-RapidAPI-Host': process.env.RAPID_API_HOST,
      },
    }

    axios
      .request(options)
      .then(function (response) {
        console.log(response.data)
        const arrayOfData = Object.keys(response.data.data).map(
          (key) => response.data.data[key]
        )
        setLanguages(arrayOfData)
      })
      .catch(function (error) {
        console.error(error)
      })
  }

  const translate = () => {
    const options = {
      method: 'GET',
      url: 'https://google-translate20.p.rapidapi.com/translate',
      params: {
        text: textToTranslate,
        tl: outputLanguage,
        sl: inputLanguage,
      },
      headers: {
        headers: {
          'X-RapidAPI-Key': process.env.RAPID_API_KEY,
          'X-RapidAPI-Host': process.env.RAPID_API_HOST,
        },
      },
    }

    axios
      .request(options)
      .then(function (response) {
        console.log(response.data)
        setTranslatedText(response.data.data.translation)
      })
      .catch(function (error) {
        console.error(error)
      })
  }

  console.log('languages', languages)
  useEffect(() => {
    getLanguages()
  }, [])

  const handleClick = () => {
    setInputLanguage(outputLanguage)
    setOutputLanguage(inputLanguage)
  }

  return (
    <div className='app'>
      {!showModal && (
        <>
          <TextBox
            selectedLanguage={inputLanguage}
            style='input'
            setShowModal={setShowModal}
            textToTranslate={textToTranslate}
            setTextToTranslate={setTextToTranslate}
            setTranslatedText={setTranslatedText}
          />

          <div className='arrow-container' onClick={handleClick}>
            {' '}
            <Arrows />
          </div>

          <TextBox
            selectedLanguage={outputLanguage}
            style='output'
            setShowModal={setShowModal}
            translatedText={translatedText}
          />
          <div className='button-container' onClick={translate}>
            <Button />
          </div>
        </>
      )}
      {showModal && (
        <Modal
          showModal={showModal}
          setShowModal={setShowModal}
          languages={languages}
          chosenLanguage={
            showModal === 'input' ? inputLanguage : outputLanguage
          }
          setChosenLanguage={
            showModal === 'input' ? setInputLanguage : setOutputLanguage
          }
        />
      )}
    </div>
  )
}

export default App
