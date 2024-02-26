import { render, fireEvent, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import withSmartCompose from './smartCompose';
import { EditableDiv } from './App';


const EnhancedComponent = withSmartCompose(EditableDiv);

describe('withSmartCompose HOC', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('renders correctly and fetches suggestions', async () => {
        const { findByText } = render(<EnhancedComponent 
            data-testid="editable-div" onChange={() => { }} />);
        const editableDiv = screen.getByTestId('editable-div');

        console.log(editableDiv);

        fireEvent.input(editableDiv, { target: { textContent: 'test' } });

        const suggestion = await findByText('[suggesting]');
        expect(suggestion).toBeInTheDocument();
    });

    test('fetches suggestions and auto-fills on tab press', async () => {
        render(<EnhancedComponent 
            data-testid="editable-div" onChange={() => { }} onKeyDown={() => { }} />);

        const editableDiv = screen.getByTestId('editable-div');
        fireEvent.input(editableDiv, { target: { innerText: 'test' } });

        await waitFor(() => expect(global.fetch).toHaveBeenCalledTimes(1));

        fireEvent.keyDown(editableDiv, { key: 'Tab', code: 'Tab' });

        await waitFor(() => expect(editableDiv).toHaveTextContent('test[suggesting]'));
    });
});
