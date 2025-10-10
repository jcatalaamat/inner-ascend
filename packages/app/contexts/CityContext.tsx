import { createContext, useContext, useState, type ReactNode } from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { useEffect } from 'react'

type CityContextType = {
  selectedCity: string
  setSelectedCity: (city: string) => void
}

const CityContext = createContext<CityContextType | undefined>(undefined)

export function CityProvider({ children }: { children: ReactNode }) {
  const [selectedCity, setSelectedCityState] = useState('mazunte')

  // Load saved city on mount
  useEffect(() => {
    AsyncStorage.getItem('selectedCity').then((city) => {
      if (city) {
        setSelectedCityState(city)
      }
    })
  }, [])

  const setSelectedCity = (city: string) => {
    setSelectedCityState(city)
    AsyncStorage.setItem('selectedCity', city)
  }

  return (
    <CityContext.Provider value={{ selectedCity, setSelectedCity }}>
      {children}
    </CityContext.Provider>
  )
}

export function useCity() {
  const context = useContext(CityContext)
  if (context === undefined) {
    throw new Error('useCity must be used within a CityProvider')
  }
  return context
}
