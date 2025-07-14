import { useState, useCallback } from 'react';

export default function useModal() {
  const [modals, setModals] = useState({});
  const [loading, setLoading] = useState({});
  const [errors, setErrors] = useState({});

  const openModal = useCallback((name, data = null) => {
    setModals(prev => ({
      ...prev,
      [name]: { isOpen: true, data }
    }));
    setErrors(prev => ({ ...prev, [name]: null }));
  }, []);

  const closeModal = useCallback((name) => {
    setModals(prev => ({
      ...prev,
      [name]: { isOpen: false, data: null }
    }));
    setLoading(prev => ({ ...prev, [name]: false }));
    setErrors(prev => ({ ...prev, [name]: null }));
  }, []);

  const toggleModal = useCallback((name) => {
    setModals(prev => ({
      ...prev,
      [name]: {
        isOpen: !prev[name]?.isOpen,
        data: prev[name]?.data ?? null
      }
    }));
  }, []);

  const isModalOpen = useCallback((name) => {
    return !!modals[name]?.isOpen;
  }, [modals]);

  const getModalData = useCallback((name) => {
    return modals[name]?.data;
  }, [modals]);

  const isLoading = useCallback((name) => {
    return !!loading[name];
  }, [loading]);

  const getError = useCallback((name) => {
    return errors[name];
  }, [errors]);

  const runModalAction = useCallback(async (name, asyncAction) => {
    try {
      setLoading(prev => ({ ...prev, [name]: true }));
      setErrors(prev => ({ ...prev, [name]: null }));
      const result = await asyncAction();
      setLoading(prev => ({ ...prev, [name]: false }));
      return result;
    } catch (err) {
      setLoading(prev => ({ ...prev, [name]: false }));
      setErrors(prev => ({ ...prev, [name]: err.message || 'Something went wrong' }));
      return null;
    }
  }, []);

  return {
    openModal,
    closeModal,
    toggleModal,
    isModalOpen,
    getModalData,
    runModalAction,
    isLoading,
    getError,
    modals
  };
}
