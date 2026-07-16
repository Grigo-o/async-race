import { useEffect } from 'react';
import type { JSX } from 'react';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import {
  loadCars,
  addCar,
  editCar,
  setCreateFormField,
  setUpdateFormField,
  resetCreateForm,
  setSelectedCar,
} from './garageSlice';
import CarForm from './components/CarForm';
import CarItem from './components/CarItem';
import RaceControls from './components/RaceControls';
import WinnerBanner from './components/WinnerBanner';
import Pagination from '../../components/Pagination';
import { CARS_PER_PAGE } from '../../utils/constants';
import './garage.css';

function GarageView(): JSX.Element {
  const dispatch = useAppDispatch();
  const { cars, totalCount, page, loading, isRacing, createForm, updateForm, selectedCarId } =
    useAppSelector((state) => state.garage);

  useEffect(() => {
    dispatch(loadCars(page));
  }, [dispatch, page]);

  const handleCreateSubmit = (): void => {
    dispatch(addCar({ name: createForm.name.trim(), color: createForm.color }));
    dispatch(resetCreateForm());
  };

  const handleUpdateSubmit = (): void => {
    if (selectedCarId === null) {
      return;
    }
    dispatch(
      editCar({
        id: selectedCarId,
        payload: { name: updateForm.name.trim(), color: updateForm.color },
      }),
    );
    dispatch(setSelectedCar(null));
  };

  const handlePageChange = (nextPage: number): void => {
    dispatch(loadCars(nextPage));
  };

  return (
    <section className="garage-view">
      <h1>Garage</h1>
      <WinnerBanner />

      <div className="form-panel">
        <CarForm
          name={createForm.name}
          color={createForm.color}
          onNameChange={(name) => dispatch(setCreateFormField({ name }))}
          onColorChange={(color) => dispatch(setCreateFormField({ color }))}
          onSubmit={handleCreateSubmit}
          submitLabel="Create"
          disabled={isRacing}
        />
        <CarForm
          name={updateForm.name}
          color={updateForm.color}
          onNameChange={(name) => dispatch(setUpdateFormField({ name }))}
          onColorChange={(color) => dispatch(setUpdateFormField({ color }))}
          onSubmit={handleUpdateSubmit}
          submitLabel="Update"
          disabled={isRacing || selectedCarId === null}
        />
      </div>

      <RaceControls />

      <p className="car-count">Cars in Garage: {totalCount}</p>

      {loading && <p>Loading...</p>}
      {!loading && cars.length === 0 && <p className="empty-message">No Cars</p>}

      <div className="garage-list">
        {cars.map((car) => (
          <CarItem key={car.id} car={car} />
        ))}
      </div>

      <Pagination
        currentPage={page}
        totalItems={totalCount}
        itemsPerPage={CARS_PER_PAGE}
        onPageChange={handlePageChange}
      />
    </section>
  );
}

export default GarageView;
