import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { FileUploader } from '@/components/FileUploader';

describe('FileUploader', () => {
  it('renders drag area and preview after file upload', async () => {
    const onLayer = jest.fn();
    render(<FileUploader onLayer={onLayer} />);
    expect(screen.getByLabelText('file-drop-area')).toBeInTheDocument();

    const file = new File(['lat,lon,name\n-33.9,151.2,tree-a'], 'sample.csv', { type: 'text/csv' });
    fireEvent.change(screen.getByLabelText('file-input'), { target: { files: [file] } });

    await waitFor(() => expect(screen.getByText(/Preview/i)).toBeInTheDocument());
    expect(onLayer).toHaveBeenCalled();
  });
});
