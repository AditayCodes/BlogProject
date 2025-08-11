import { Controller } from 'react-hook-form';
import { useState, useRef } from 'react';

function SimpleRTE({ name, control, label, defaultValue = "" }) {
    const [isFocused, setIsFocused] = useState(false);
    const editorRef = useRef(null);

    console.log(`🖊️ SimpleRTE initialized with defaultValue:`, defaultValue);

    // Helper function to insert text at cursor position
    const insertTextAtCursor = (text) => {
        const textarea = editorRef.current;
        if (!textarea) return;

        const start = textarea.selectionStart;
        const end = textarea.selectionEnd;
        const currentValue = textarea.value;

        const newValue = currentValue.substring(0, start) + text + currentValue.substring(end);
        textarea.value = newValue;

        // Trigger onChange
        const event = new Event('input', { bubbles: true });
        textarea.dispatchEvent(event);

        // Set cursor position after inserted text
        setTimeout(() => {
            textarea.selectionStart = textarea.selectionEnd = start + text.length;
            textarea.focus();
        }, 0);
    };

    const formatText = (type) => {
        const textarea = editorRef.current;
        if (!textarea) return;

        const start = textarea.selectionStart;
        const end = textarea.selectionEnd;
        const selectedText = textarea.value.substring(start, end);

        let formattedText = '';

        switch (type) {
            case 'bold':
                formattedText = `**${selectedText || 'bold text'}**`;
                break;
            case 'italic':
                formattedText = `*${selectedText || 'italic text'}*`;
                break;
            case 'heading':
                formattedText = `# ${selectedText || 'Heading'}`;
                break;
            case 'list':
                formattedText = `- ${selectedText || 'List item'}`;
                break;
            case 'link':
                formattedText = `[${selectedText || 'link text'}](url)`;
                break;
            default:
                return;
        }

        const currentValue = textarea.value;
        const newValue = currentValue.substring(0, start) + formattedText + currentValue.substring(end);

        textarea.value = newValue;

        // Trigger onChange
        const event = new Event('input', { bubbles: true });
        textarea.dispatchEvent(event);

        // Set cursor position
        setTimeout(() => {
            textarea.selectionStart = textarea.selectionEnd = start + formattedText.length;
            textarea.focus();
        }, 0);
    };

    return (
        <div className='w-full'>
            {label && (
                <label className='inline-block mb-1 pl-1 text-sm font-medium text-gray-700'>
                    {label}
                </label>
            )}
            
            <Controller
                name={name || "content"}
                control={control}
                render={({ field: { onChange, value } }) => {
                    console.log(`📝 SimpleRTE field value:`, value);

                    return (
                        <div className="border border-gray-300 rounded-lg overflow-hidden">
                            {/* Toolbar */}
                            <div className="bg-gray-50 border-b border-gray-300 p-2 flex flex-wrap gap-1">
                                <button
                                    type="button"
                                    onClick={() => formatText('bold')}
                                    className="px-3 py-1 text-sm bg-white border border-gray-300 rounded hover:bg-gray-100"
                                    title="Bold (**text**)"
                                >
                                    <strong>B</strong>
                                </button>
                                <button
                                    type="button"
                                    onClick={() => formatText('italic')}
                                    className="px-3 py-1 text-sm bg-white border border-gray-300 rounded hover:bg-gray-100"
                                    title="Italic (*text*)"
                                >
                                    <em>I</em>
                                </button>
                                <button
                                    type="button"
                                    onClick={() => formatText('heading')}
                                    className="px-3 py-1 text-sm bg-white border border-gray-300 rounded hover:bg-gray-100"
                                    title="Heading (# text)"
                                >
                                    H1
                                </button>
                                <button
                                    type="button"
                                    onClick={() => formatText('list')}
                                    className="px-3 py-1 text-sm bg-white border border-gray-300 rounded hover:bg-gray-100"
                                    title="List (- item)"
                                >
                                    • List
                                </button>
                                <button
                                    type="button"
                                    onClick={() => formatText('link')}
                                    className="px-3 py-1 text-sm bg-white border border-gray-300 rounded hover:bg-gray-100"
                                    title="Link ([text](url))"
                                >
                                    🔗 Link
                                </button>
                            </div>

                            {/* Simple Textarea Editor */}
                            <textarea
                                ref={editorRef}
                                className={`w-full min-h-[300px] p-4 resize-y focus:outline-none border-0 ${
                                    isFocused ? 'ring-2 ring-emerald-500' : ''
                                }`}
                                style={{
                                    fontSize: '14px',
                                    lineHeight: '1.5',
                                    fontFamily: 'Helvetica, Arial, sans-serif'
                                }}
                                value={value || defaultValue || ''}
                                onChange={(e) => {
                                    const content = e.target.value;
                                    console.log(`📝 SimpleRTE content changed:`, content);
                                    onChange(content);
                                }}
                                onFocus={() => setIsFocused(true)}
                                onBlur={() => setIsFocused(false)}
                                placeholder="Start writing your post content here... Use the toolbar above for formatting."
                            />

                            {/* Help text */}
                            <div className="bg-gray-50 border-t border-gray-300 px-4 py-2 text-xs text-gray-600">
                                💡 Tip: Select text and use toolbar buttons, or type markdown directly (**bold**, *italic*, # heading, - list)
                            </div>
                        </div>
                    );
                }}
            />
        </div>
    );
}

export default SimpleRTE;
