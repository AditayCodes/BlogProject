
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
                    return (
                        <Editor
                            apiKey="n94difusnppky4sh7s9y6jr66l6x36ar8l1tncbk0y15kyy7"
                            value={value || defaultValue}
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
                                setup: (editor) => {
                                    editor.on('init', () => {
                                        console.log('📝 TinyMCE editor initialized');
                                        if (value || defaultValue) {
                                            editor.setContent(value || defaultValue);
                                        }
                                    });
                                }
                            }}
                            onEditorChange={(content) => {
                                console.log(`📝 Editor content changed:`, content);
                                onChange(content);
                            }}
                        />
                    );
                }}
            />
        </div>
    )
}

export default RTE;