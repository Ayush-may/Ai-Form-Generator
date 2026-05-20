import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import http from '../libs/http';
import LiveFormComponent from '../components/LiveFormComponent';
import "../styles/LiveFormComponent.css"
import { FiGithub } from 'react-icons/fi';

const LiveForm = () => {
    const { slug } = useParams();
    const [form, setForm] = useState<{
        id: string;
        slug: string;
        schema: { form: any };
    } | null>()

    useEffect(() => {
        const fetchForm = async () => {
            try {
                const response = await http.get(`/form/slug/${slug}`);
                setForm(response.data);
                console.log(response.data);
            } catch (error) {
                console.error(error);
            }
        };

        if (slug) {
            fetchForm();
        }
    }, [slug]);

    return (
        <div className='__live-form-container'>
            <div className='__left-side'>
                <div className='__blob __blob-1'></div>
                <div className='__blob __blob-2'></div>
                <div className='__blob __blob-3'></div>

                <div className='__line __line-1'></div>
                <div className='__line __line-2'></div>

                <div className='__ring __ring-1'></div>
                <div className='__ring __ring-2'></div>

                <div className='__left-content'>
                    <h1>AI-Form Generator</h1>
                    <p>
                        Fast, beautiful, AI-generated forms for collecting responses effortlessly.
                    </p>

                    <div className='__creator-credit'>
                        <span>Made with ❤️ by</span>

                        <a
                            href="https://github.com/your-github-username"
                            target="_blank"
                            rel="noreferrer"
                        >
                            <FiGithub />
                            Ayush Sharma
                        </a>
                    </div>

                </div>
            </div>
            <div className='__right-side' >
                {
                    // form?.schema && <LiveFormComponent previewForm={form?.schema} />
                    form && <LiveFormComponent form={form} formId={form?.id} />
                }
            </div>
        </div>
    );
};

export default LiveForm;