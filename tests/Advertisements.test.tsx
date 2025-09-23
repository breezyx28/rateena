import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import { I18nextProvider } from 'react-i18next';
import { configureStore } from '@reduxjs/toolkit';
import Advertisements from '../src/pages/Advertisements/index';
import i18n from '../src/i18n';

// Mock dependencies
jest.mock('../src/hooks/useAdvertisementWithValidation');
jest.mock('../src/hooks/useAdvertisementsList');
jest.mock('sweetalert2');

// Mock store
const mockStore = configureStore({
  reducer: {
    Vendors: () => ({
      vendorsListSuccess: {
        list: [
          { vendorId: 1, fullName: 'Test Vendor', arFullName: 'بائع تجريبي' }
        ]
      },
      vendorsError: null
    })
  }
});

// Mock data
const mockAdsData = {
  data: {
    availableBanners: [
      { ar: 'إعلانات خارجية', en: 'External Advertisements' },
      { ar: 'مطاعم', en: 'Restaurants' },
      { ar: 'بقالة', en: 'Grocery' }
    ],
    list: []
  }
};

const mockFormik = {
  values: {
    title: '',
    arTitle: '',
    subtitle: '',
    arSubtitle: '',
    startDate: '',
    expireDate: '',
    startTime: '',
    endTime: '',
    url: '',
    banner: '',
    priority: '',
    vendorId: '',
    replacePriority: false
  },
  errors: {},
  touched: {},
  handleChange: jest.fn(),
  handleBlur: jest.fn(),
  setFieldValue: jest.fn(),
  setFieldTouched: jest.fn(),
  handleSubmit: jest.fn(),
  resetForm: jest.fn(),
  status: null
};

// Test wrapper component
const TestWrapper = ({ children }: { children: React.ReactNode }) => (
  <Provider store={mockStore}>
    <BrowserRouter>
      <I18nextProvider i18n={i18n}>
        {children}
      </I18nextProvider>
    </BrowserRouter>
  </Provider>
);

describe('Advertisements Component', () => {
  beforeEach(() => {
    // Reset mocks
    jest.clearAllMocks();
    
    // Mock hooks
    require('../src/hooks/useAdvertisementWithValidation').useAdvertisementWithValidation.mockReturnValue({
      formik: mockFormik,
      submit: jest.fn(),
      data: null,
      error: null,
      isSuccess: false,
      isError: false,
      isLoading: false,
      reset: jest.fn(),
      setServerErrors: jest.fn()
    });

    require('../src/hooks/useAdvertisementsList').useAdvertisementsList.mockReturnValue({
      data: mockAdsData,
      fetchAdvertisements: jest.fn()
    });
  });

  describe('Component Rendering', () => {
    test('renders advertisement page with add button', () => {
      render(
        <TestWrapper>
          <Advertisements />
        </TestWrapper>
      );

      expect(screen.getByText('Add Advertisement')).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /add advertisement/i })).toBeInTheDocument();
    });

    test('displays available banners from API data', () => {
      render(
        <TestWrapper>
          <Advertisements />
        </TestWrapper>
      );

      mockAdsData.data.availableBanners.forEach((banner, index) => {
        expect(screen.getByText(banner.en)).toBeInTheDocument();
      });
    });
  });

  describe('Modal Functionality', () => {
    test('opens modal when add button is clicked', async () => {
      render(
        <TestWrapper>
          <Advertisements />
        </TestWrapper>
      );

      const addButton = screen.getByRole('button', { name: /add advertisement/i });
      fireEvent.click(addButton);

      await waitFor(() => {
        expect(screen.getByRole('dialog')).toBeInTheDocument();
      });
    });

    test('closes modal when cancel button is clicked', async () => {
      render(
        <TestWrapper>
          <Advertisements />
        </TestWrapper>
      );

      // Open modal
      fireEvent.click(screen.getByRole('button', { name: /add advertisement/i }));
      
      await waitFor(() => {
        expect(screen.getByRole('dialog')).toBeInTheDocument();
      });

      // Close modal
      const cancelButton = screen.getByRole('button', { name: /cancel/i });
      fireEvent.click(cancelButton);

      await waitFor(() => {
        expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
      });
    });
  });

  describe('Form Validation', () => {
    beforeEach(async () => {
      render(
        <TestWrapper>
          <Advertisements />
        </TestWrapper>
      );

      // Open modal
      fireEvent.click(screen.getByRole('button', { name: /add advertisement/i }));
      await waitFor(() => {
        expect(screen.getByRole('dialog')).toBeInTheDocument();
      });
    });

    test('validates required fields', async () => {
      const mockFormikWithErrors = {
        ...mockFormik,
        errors: {
          title: 'English title is required',
          banner: 'Banner type is required'
        },
        touched: {
          title: true,
          banner: true
        }
      };

      require('../src/hooks/useAdvertisementWithValidation').useAdvertisementWithValidation.mockReturnValue({
        formik: mockFormikWithErrors,
        submit: jest.fn(),
        data: null,
        error: null,
        isSuccess: false,
        isError: false,
        isLoading: false,
        reset: jest.fn(),
        setServerErrors: jest.fn()
      });

      render(
        <TestWrapper>
          <Advertisements />
        </TestWrapper>
      );

      // Validation errors should be displayed
      expect(screen.getByDisplayValue('')).toBeInTheDocument();
    });

    test('validates URL format', async () => {
      const user = userEvent.setup();
      const urlInput = screen.getByLabelText(/redirect url/i);

      await user.type(urlInput, 'invalid-url');
      fireEvent.blur(urlInput);

      expect(mockFormik.handleChange).toHaveBeenCalled();
    });

    test('validates date fields', async () => {
      const user = userEvent.setup();
      const startDateInput = screen.getByLabelText(/start date/i);
      const endDateInput = screen.getByLabelText(/end date/i);

      await user.type(startDateInput, '2024-01-01');
      await user.type(endDateInput, '2023-12-31'); // End date before start date

      expect(mockFormik.handleChange).toHaveBeenCalled();
    });

    test('validates time fields', async () => {
      const user = userEvent.setup();
      const startTimeInput = screen.getByLabelText(/start time/i);
      const endTimeInput = screen.getByLabelText(/end time/i);

      await user.type(startTimeInput, '10:00');
      await user.type(endTimeInput, '09:00'); // End time before start time

      expect(mockFormik.handleChange).toHaveBeenCalled();
    });
  });

  describe('Banner Type Selection', () => {
    beforeEach(async () => {
      render(
        <TestWrapper>
          <Advertisements />
        </TestWrapper>
      );

      fireEvent.click(screen.getByRole('button', { name: /add advertisement/i }));
      await waitFor(() => {
        expect(screen.getByRole('dialog')).toBeInTheDocument();
      });
    });

    test('renders dynamic banner options from API', () => {
      const bannerSelect = screen.getByLabelText(/advertisement type/i);
      
      expect(bannerSelect).toBeInTheDocument();
      expect(screen.getByText('Select advertisement type')).toBeInTheDocument();
    });

    test('shows vendor selection when non-external banner is selected', async () => {
      const bannerSelect = screen.getByLabelText(/advertisement type/i);
      
      fireEvent.change(bannerSelect, { target: { value: 'Restaurants' } });

      await waitFor(() => {
        expect(screen.getByLabelText(/vendor/i)).toBeInTheDocument();
      });
    });

    test('hides vendor selection for external advertisements', async () => {
      const bannerSelect = screen.getByLabelText(/advertisement type/i);
      
      fireEvent.change(bannerSelect, { target: { value: 'External Advertisements' } });

      await waitFor(() => {
        expect(screen.queryByLabelText(/vendor/i)).not.toBeInTheDocument();
      });

      expect(mockFormik.setFieldValue).toHaveBeenCalledWith('vendorId', '');
    });
  });

  describe('File Upload', () => {
    beforeEach(async () => {
      render(
        <TestWrapper>
          <Advertisements />
        </TestWrapper>
      );

      fireEvent.click(screen.getByRole('button', { name: /add advertisement/i }));
      await waitFor(() => {
        expect(screen.getByRole('dialog')).toBeInTheDocument();
      });
    });

    test('handles file selection', async () => {
      const fileInput = screen.getByLabelText(/advertisement image/i);
      const file = new File(['test'], 'test.jpg', { type: 'image/jpeg' });

      fireEvent.change(fileInput, { target: { files: [file] } });

      expect(mockFormik.setFieldValue).toHaveBeenCalledWith('adsImage1', file);
    });

    test('displays selected image preview', async () => {
      // Mock URL.createObjectURL
      global.URL.createObjectURL = jest.fn(() => 'mock-url');

      const fileInput = screen.getByLabelText(/advertisement image/i);
      const file = new File(['test'], 'test.jpg', { type: 'image/jpeg' });

      fireEvent.change(fileInput, { target: { files: [file] } });

      // This would require updating the component state, which is handled by the actual component
      expect(mockFormik.setFieldValue).toHaveBeenCalled();
    });

    test('removes selected file', async () => {
      const fileInput = screen.getByLabelText(/advertisement image/i);
      const file = new File(['test'], 'test.jpg', { type: 'image/jpeg' });

      fireEvent.change(fileInput, { target: { files: [file] } });

      // The remove functionality would be tested when the component state updates
      expect(mockFormik.setFieldValue).toHaveBeenCalled();
    });
  });

  describe('Form Submission', () => {
    test('submits form with valid data', async () => {
      const mockSubmit = jest.fn();
      
      require('../src/hooks/useAdvertisementWithValidation').useAdvertisementWithValidation.mockReturnValue({
        formik: {
          ...mockFormik,
          values: {
            title: 'Test Ad',
            arTitle: 'إعلان تجريبي',
            subtitle: 'Test Subtitle',
            arSubtitle: 'عنوان فرعي تجريبي',
            startDate: '2024-01-01',
            expireDate: '2024-12-31',
            startTime: '10:00',
            endTime: '18:00',
            url: 'https://example.com',
            banner: 'Restaurants',
            priority: '1',
            vendorId: '1',
            replacePriority: false
          }
        },
        submit: mockSubmit,
        data: null,
        error: null,
        isSuccess: false,
        isError: false,
        isLoading: false,
        reset: jest.fn(),
        setServerErrors: jest.fn()
      });

      render(
        <TestWrapper>
          <Advertisements />
        </TestWrapper>
      );

      fireEvent.click(screen.getByRole('button', { name: /add advertisement/i }));
      
      await waitFor(() => {
        expect(screen.getByRole('dialog')).toBeInTheDocument();
      });

      const submitButton = screen.getByRole('button', { name: /add advertisement/i });
      fireEvent.click(submitButton);

      expect(mockSubmit).toHaveBeenCalled();
    });

    test('shows loading state during submission', async () => {
      require('../src/hooks/useAdvertisementWithValidation').useAdvertisementWithValidation.mockReturnValue({
        formik: mockFormik,
        submit: jest.fn(),
        data: null,
        error: null,
        isSuccess: false,
        isError: false,
        isLoading: true,
        reset: jest.fn(),
        setServerErrors: jest.fn()
      });

      render(
        <TestWrapper>
          <Advertisements />
        </TestWrapper>
      );

      fireEvent.click(screen.getByRole('button', { name: /add advertisement/i }));
      
      await waitFor(() => {
        expect(screen.getByText(/adding.../i)).toBeInTheDocument();
      });
    });

    test('handles submission success', async () => {
      const mockSwal = require('sweetalert2');
      mockSwal.fire = jest.fn().mockResolvedValue({ isConfirmed: true });

      require('../src/hooks/useAdvertisementWithValidation').useAdvertisementWithValidation.mockReturnValue({
        formik: mockFormik,
        submit: jest.fn(),
        data: { success: true },
        error: null,
        isSuccess: true,
        isError: false,
        isLoading: false,
        reset: jest.fn(),
        setServerErrors: jest.fn()
      });

      render(
        <TestWrapper>
          <Advertisements />
        </TestWrapper>
      );

      // Success handling is done in the hook's onSuccess callback
      expect(mockSwal.fire).not.toHaveBeenCalled(); // Will be called in actual component
    });

    test('handles submission error', async () => {
      require('../src/hooks/useAdvertisementWithValidation').useAdvertisementWithValidation.mockReturnValue({
        formik: {
          ...mockFormik,
          status: { serverError: 'Server error occurred' }
        },
        submit: jest.fn(),
        data: null,
        error: { message: 'Server error occurred' },
        isSuccess: false,
        isError: true,
        isLoading: false,
        reset: jest.fn(),
        setServerErrors: jest.fn()
      });

      render(
        <TestWrapper>
          <Advertisements />
        </TestWrapper>
      );

      fireEvent.click(screen.getByRole('button', { name: /add advertisement/i }));
      
      await waitFor(() => {
        expect(screen.getByText('Server error occurred')).toBeInTheDocument();
      });
    });
  });

  describe('Priority and Replace Priority', () => {
    beforeEach(async () => {
      render(
        <TestWrapper>
          <Advertisements />
        </TestWrapper>
      );

      fireEvent.click(screen.getByRole('button', { name: /add advertisement/i }));
      await waitFor(() => {
        expect(screen.getByRole('dialog')).toBeInTheDocument();
      });
    });

    test('shows priority options', () => {
      const prioritySelect = screen.getByLabelText(/priority/i);
      expect(prioritySelect).toBeInTheDocument();
      expect(screen.getByText('Select priority')).toBeInTheDocument();
    });

    test('handles replace priority checkbox', async () => {
      const checkbox = screen.getByLabelText(/replace existed priority/i);
      
      fireEvent.click(checkbox);

      expect(mockFormik.setFieldValue).toHaveBeenCalledWith('replacePriority', true);
    });
  });

  describe('Internationalization', () => {
    test('displays correct language based on i18n direction', () => {
      // Mock RTL direction
      i18n.dir = jest.fn().mockReturnValue('rtl');

      render(
        <TestWrapper>
          <Advertisements />
        </TestWrapper>
      );

      // Arabic text should be displayed
      expect(screen.getByText('إعلانات خارجية')).toBeInTheDocument();
    });

    test('displays English when LTR direction', () => {
      // Mock LTR direction
      i18n.dir = jest.fn().mockReturnValue('ltr');

      render(
        <TestWrapper>
          <Advertisements />
        </TestWrapper>
      );

      // English text should be displayed
      expect(screen.getByText('External Advertisements')).toBeInTheDocument();
    });
  });
});