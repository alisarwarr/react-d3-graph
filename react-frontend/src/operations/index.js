import { handleEditGraph } from '../appsync/mutations';


export const createCategoryNODE = async ({ id, name, data, _groupName, _categoryName, _svgIcon }) => {
    await handleEditGraph({
        id,
        name,
        data: {
            link: [
                ...data.link,
                {
                    source: _groupName,
                    target: _categoryName
                }
            ],
            node: [
                ...data.node,
                {
                    id: _categoryName,
                    svg: _svgIcon,
                    size: 400,
                    connection: `${data.node[data.node.length-1].connection}-${_categoryName}`
                }
            ]
        }
    });
}