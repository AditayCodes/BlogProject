import { Controller } from 'react-hook-form';
import { useState } from 'react';

function SimpleRTE({ name, control, label, defaultValue = "" }) {
    const [isFocused, setIsFocused] = useState(false);

    console.log(`🖊️ SimpleRTE initialized with defaultValue:`, defaultValue);

    const formatText = (command, value = null) => {
        document.execCommand(command, false, value);
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
                                    title="Bold"
                                >
                                    <strong>B</strong>
                                </button>
                                <button
                                    type="button"
                                    onClick={() => formatText('italic')}
                                    className="px-3 py-1 text-sm bg-white border border-gray-300 rounded hover:bg-gray-100"
                                    title="Italic"
                                >
                                    <em>I</em>
                                </button>
                                <button
                                    type="button"
                                    onClick={() => formatText('underline')}
                                    className="px-3 py-1 text-sm bg-white border border-gray-300 rounded hover:bg-gray-100"
                                    title="Underline"
                                >
                                    <u>U</u>
                                </button>
                                <div className="w-px bg-gray-300 mx-1"></div>
                                <button
                                    type="button"
                                    onClick={() => formatText('insertUnorderedList')}
                                    className="px-3 py-1 text-sm bg-white border border-gray-300 rounded hover:bg-gray-100"
                                    title="Bullet List"
                                >
                                    • List
                                </button>
                                <button
                                    type="button"
                                    onClick={() => formatText('insertOrderedList')}
                                    className="px-3 py-1 text-sm bg-white border border-gray-300 rounded hover:bg-gray-100"
                                    title="Numbered List"
                                >
                                    1. List
                                </button>
                                <div className="w-px bg-gray-300 mx-1"></div>
                                <button
                                    type="button"
                                    onClick={() => formatText('justifyLeft')}
                                    className="px-3 py-1 text-sm bg-white border border-gray-300 rounded hover:bg-gray-100"
                                    title="Align Left"
                                >
                                    ←
                                </button>
                                <button
                                    type="button"
                                    onClick={() => formatText('justifyCenter')}
                                    className="px-3 py-1 text-sm bg-white border border-gray-300 rounded hover:bg-gray-100"
                                    title="Align Center"
                                >
                                    ↔
                                </button>
                                <button
                                    type="button"
                                    onClick={() => formatText('justifyRight')}
                                    className="px-3 py-1 text-sm bg-white border border-gray-300 rounded hover:bg-gray-100"
                                    title="Align Right"
                                >
                                    →
                                </button>
                            </div>

                            {/* Editor */}
                            <div
                                contentEditable
                                className={`min-h-[300px] p-4 focus:outline-none ${
                                    isFocused ? 'ring-2 ring-emerald-500' : ''
                                }`}
                                style={{
                                    fontSize: '14px',
                                    lineHeight: '1.5',
                                    fontFamily: 'Helvetica, Arial, sans-serif'
                                }}
                                dangerouslySetInnerHTML={{ __html: value || defaultValue || '' }}
                                onInput={(e) => {
                                    const content = e.target.innerHTML;
                                    console.log(`📝 SimpleRTE content changed:`, content);
                                    onChange(content);
                                }}
                                onFocus={() => setIsFocused(true)}
                                onBlur={() => setIsFocused(false)}
                                data-placeholder="Start writing your post content here..."
                            />
                            
                            {/* Placeholder styling */}
                            <style jsx>{`
                                [contenteditable]:empty:before {
                                    content: attr(data-placeholder);
                                    color: #9CA3AF;
                                    font-style: italic;
                                }
                            `}</style>
                        </div>
                    );
                }}
            />
        </div>
    );
}

export default SimpleRTE;
