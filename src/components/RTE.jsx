
import {Editor } from '@tinymce/tinymce-react';
import {Controller } from 'react-hook-form';


 function RTE({ name, control, label, defaultValue = "" }) {
    console.log(`🖊️ RTE initialized with defaultValue:`, defaultValue);

    return (
        <div className='w-full'>
            {label &&
                <label className='inline-block mb-1 pl-1'>
                    {label}
                </label>}
            <Controller
                name={name || "content"}
                control={control}
                render={({ field: { onChange, value } }) => {
                    console.log(`📝 RTE field value:`, value);
                    console.log(`📝 RTE field value type:`, typeof value);
                    console.log(`📝 RTE field value length:`, value ? value.length : 0);

                    return (
                        <Editor
                            value={value || defaultValue || ""}
                            init={{
                                height: 500,
                                menubar: true,
                                plugins: [
                                    "image",
                                    "advlist",
                                    "autolink",
                                    "lists",
                                    "link",
                                    "charmap",
                                    "preview",
                                    "anchor",
                                    "searchreplace",
                                    "visualblocks",
                                    "code",
                                    "fullscreen",
                                    "insertdatetime",
                                    "media",
                                    "table",
                                    "help",
                                    "wordcount",
                                ],
                                toolbar:
                                    "undo redo | blocks | image | bold italic forecolor | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | removeformat | help",
                                content_style: "body { font-family:Helvetica,Arial,sans-serif; font-size:14px }",
                                placeholder: "Start writing your post content here...",
                                setup: (editor) => {
                                    editor.on('init', () => {
                                        console.log('📝 TinyMCE editor initialized successfully');
                                        if (value || defaultValue) {
                                            console.log('📝 Setting initial content:', value || defaultValue);
                                            editor.setContent(value || defaultValue);
                                        }
                                    });

                                    editor.on('change', () => {
                                        const content = editor.getContent();
                                        console.log('📝 Editor content changed (via change event):', content);
                                    });
                                }
                            }}
                            onEditorChange={(content, editor) => {
                                console.log(`📝 Editor content changed (onEditorChange):`, content);
                                console.log(`📝 Content length:`, content ? content.length : 0);
                                console.log(`📝 Content type:`, typeof content);
                                try {
                                    onChange(content);
                                    console.log(`✅ Content successfully passed to form`);
                                } catch (error) {
                                    console.error(`❌ Error updating form content:`, error);
                                }
                            }}
                            onInit={(evt, editor) => {
                                console.log('📝 TinyMCE onInit called');
                                console.log('📝 Editor ready for input');
                            }}
                            onLoadContent={(evt, editor) => {
                                console.log('📝 TinyMCE content loaded');
                            }}
                            onError={(error) => {
                                console.error('❌ TinyMCE Error:', error);
                            }}
                        />
                    );
                }}
            />
        </div>
    )
}

export default RTE;