import { Controller } from 'react-hook-form';
import { useState, useRef, useCallback, useEffect } from 'react';

function SimpleRTE({ name, control, label, defaultValue = "" }) {
    const [isFocused, setIsFocused] = useState(false);
    const [fontSize, setFontSize] = useState('14');
    const [fontFamily, setFontFamily] = useState('Helvetica');
    const editorRef = useRef(null);

    console.log(`🖊️ SimpleRTE initialized with defaultValue:`, defaultValue);

    // Set initial content
    useEffect(() => {
        if (editorRef.current && defaultValue) {
            editorRef.current.innerHTML = defaultValue;
        }
    }, [defaultValue]);

    // Execute formatting commands
    const execCommand = useCallback((command, value = null) => {
        document.execCommand(command, false, value);
        editorRef.current?.focus();
    }, []);

    // Handle content changes
    const handleContentChange = useCallback((onChange) => {
        return () => {
            if (editorRef.current) {
                const content = editorRef.current.innerHTML;
                console.log(`📝 Content changed:`, content);
                onChange(content);
            }
        };
    }, []);

    // Save cursor position
    const saveCursorPosition = () => {
        const selection = window.getSelection();
        if (selection.rangeCount > 0) {
            return selection.getRangeAt(0);
        }
        return null;
    };

    // Restore cursor position
    const restoreCursorPosition = (range) => {
        if (range) {
            const selection = window.getSelection();
            selection.removeAllRanges();
            selection.addRange(range);
        }
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
                            {/* Enhanced Toolbar */}
                            <div className="bg-gray-50 border-b border-gray-300 p-3">
                                {/* First Row - Text Formatting */}
                                <div className="flex flex-wrap gap-1 mb-2">
                                    <button
                                        type="button"
                                        onClick={() => execCommand('bold')}
                                        className="px-3 py-1 text-sm bg-white border border-gray-300 rounded hover:bg-gray-100 font-bold"
                                        title="Bold"
                                    >
                                        B
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => execCommand('italic')}
                                        className="px-3 py-1 text-sm bg-white border border-gray-300 rounded hover:bg-gray-100 italic"
                                        title="Italic"
                                    >
                                        I
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => execCommand('underline')}
                                        className="px-3 py-1 text-sm bg-white border border-gray-300 rounded hover:bg-gray-100 underline"
                                        title="Underline"
                                    >
                                        U
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => execCommand('strikeThrough')}
                                        className="px-3 py-1 text-sm bg-white border border-gray-300 rounded hover:bg-gray-100 line-through"
                                        title="Strikethrough"
                                    >
                                        S
                                    </button>

                                    <div className="w-px bg-gray-300 mx-1"></div>

                                    {/* Font Size */}
                                    <select
                                        onChange={(e) => {
                                            setFontSize(e.target.value);
                                            execCommand('fontSize', '3');
                                            // Apply custom font size
                                            const selection = window.getSelection();
                                            if (selection.rangeCount > 0) {
                                                const range = selection.getRangeAt(0);
                                                if (!range.collapsed) {
                                                    const span = document.createElement('span');
                                                    span.style.fontSize = e.target.value + 'px';
                                                    try {
                                                        range.surroundContents(span);
                                                    } catch (e) {
                                                        span.appendChild(range.extractContents());
                                                        range.insertNode(span);
                                                    }
                                                }
                                            }
                                        }}
                                        value={fontSize}
                                        className="px-2 py-1 text-sm bg-white border border-gray-300 rounded"
                                        title="Font Size"
                                    >
                                        <option value="12">12px</option>
                                        <option value="14">14px</option>
                                        <option value="16">16px</option>
                                        <option value="18">18px</option>
                                        <option value="20">20px</option>
                                        <option value="24">24px</option>
                                        <option value="28">28px</option>
                                        <option value="32">32px</option>
                                    </select>

                                    {/* Font Family */}
                                    <select
                                        onChange={(e) => {
                                            setFontFamily(e.target.value);
                                            execCommand('fontName', e.target.value);
                                        }}
                                        value={fontFamily}
                                        className="px-2 py-1 text-sm bg-white border border-gray-300 rounded"
                                        title="Font Family"
                                    >
                                        <option value="Arial">Arial</option>
                                        <option value="Helvetica">Helvetica</option>
                                        <option value="Times New Roman">Times New Roman</option>
                                        <option value="Georgia">Georgia</option>
                                        <option value="Verdana">Verdana</option>
                                        <option value="Courier New">Courier New</option>
                                        <option value="Comic Sans MS">Comic Sans MS</option>
                                    </select>
                                </div>

                                {/* Second Row - Structure & Alignment */}
                                <div className="flex flex-wrap gap-1">
                                    <button
                                        type="button"
                                        onClick={() => execCommand('formatBlock', 'h1')}
                                        className="px-3 py-1 text-sm bg-white border border-gray-300 rounded hover:bg-gray-100"
                                        title="Heading 1"
                                    >
                                        H1
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => execCommand('formatBlock', 'h2')}
                                        className="px-3 py-1 text-sm bg-white border border-gray-300 rounded hover:bg-gray-100"
                                        title="Heading 2"
                                    >
                                        H2
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => execCommand('formatBlock', 'p')}
                                        className="px-3 py-1 text-sm bg-white border border-gray-300 rounded hover:bg-gray-100"
                                        title="Paragraph"
                                    >
                                        P
                                    </button>

                                    <div className="w-px bg-gray-300 mx-1"></div>

                                    <button
                                        type="button"
                                        onClick={() => execCommand('insertUnorderedList')}
                                        className="px-3 py-1 text-sm bg-white border border-gray-300 rounded hover:bg-gray-100"
                                        title="Bullet List"
                                    >
                                        • List
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => execCommand('insertOrderedList')}
                                        className="px-3 py-1 text-sm bg-white border border-gray-300 rounded hover:bg-gray-100"
                                        title="Numbered List"
                                    >
                                        1. List
                                    </button>

                                    <div className="w-px bg-gray-300 mx-1"></div>

                                    <button
                                        type="button"
                                        onClick={() => execCommand('justifyLeft')}
                                        className="px-3 py-1 text-sm bg-white border border-gray-300 rounded hover:bg-gray-100"
                                        title="Align Left"
                                    >
                                        ⬅️
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => execCommand('justifyCenter')}
                                        className="px-3 py-1 text-sm bg-white border border-gray-300 rounded hover:bg-gray-100"
                                        title="Align Center"
                                    >
                                        ↔️
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => execCommand('justifyRight')}
                                        className="px-3 py-1 text-sm bg-white border border-gray-300 rounded hover:bg-gray-100"
                                        title="Align Right"
                                    >
                                        ➡️
                                    </button>

                                    <div className="w-px bg-gray-300 mx-1"></div>

                                    {/* Text Colors */}
                                    <input
                                        type="color"
                                        onChange={(e) => execCommand('foreColor', e.target.value)}
                                        className="w-8 h-8 border border-gray-300 rounded cursor-pointer"
                                        title="Text Color"
                                        defaultValue="#000000"
                                    />
                                    <input
                                        type="color"
                                        onChange={(e) => execCommand('backColor', e.target.value)}
                                        className="w-8 h-8 border border-gray-300 rounded cursor-pointer"
                                        title="Background Color"
                                        defaultValue="#ffffff"
                                    />
                                </div>
                            </div>

                            {/* Rich Text Editor */}
                            <div
                                ref={editorRef}
                                contentEditable
                                className={`min-h-[300px] p-4 focus:outline-none overflow-auto ${
                                    isFocused ? 'ring-2 ring-emerald-500' : ''
                                }`}
                                style={{
                                    fontSize: fontSize + 'px',
                                    lineHeight: '1.5',
                                    fontFamily: fontFamily
                                }}
                                onKeyDown={(e) => {
                                    // Handle tab key for indentation
                                    if (e.key === 'Tab') {
                                        e.preventDefault();
                                        execCommand('insertHTML', '&nbsp;&nbsp;&nbsp;&nbsp;');
                                    }
                                }}
                                onInput={(e) => {
                                    const content = e.target.innerHTML;
                                    console.log(`📝 Content changed:`, content);
                                    onChange(content);
                                }}
                                onFocus={() => setIsFocused(true)}
                                onBlur={() => setIsFocused(false)}
                                suppressContentEditableWarning={true}
                            />

                            {/* Help text */}
                            <div className="bg-gray-50 border-t border-gray-300 px-4 py-2 text-xs text-gray-600">
                                💡 Select text and use the toolbar to format. You can change font size, family, colors, and alignment.
                            </div>
                        </div>
                    );
                }}
            />
        </div>
    );
}

export default SimpleRTE;
