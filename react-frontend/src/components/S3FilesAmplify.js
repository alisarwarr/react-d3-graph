import { useState, useEffect } from 'react';
//COMPONENTS
import Loader from './Loader';
//AWS-AMPLIFY
import { Storage } from 'aws-amplify';


function S3FilesAmplify() {
    const [loading, setLoading] = useState(false);


    async function fetchFiles() {
        let fileKeys = await Storage.list("");

        setLoading(true);            /* loader on */

        fileKeys = await Promise.all(fileKeys.map(async k => {
            const url = await Storage.get(k.key);
            return url;
        }));

        setLoading(false);           /* loader off */

        console.log('fileKeys: ', fileKeys);
    }


    async function onChange(e) {
        const file = e.target.files[0];

        setLoading(true);            /* loader on */

        const result = await Storage.put(file.name, file, {
            contentType: file.type
        });

        console.log({ result });

        setLoading(false);           /* loader off */

        fetchFiles();
    }


    useEffect(() => {
        fetchFiles();
    }, []);


    if (loading) {
        return <Loader />;
    }


    return (
        <input
            type="file"
            onChange={onChange}
        />
    )
}


export default S3FilesAmplify;