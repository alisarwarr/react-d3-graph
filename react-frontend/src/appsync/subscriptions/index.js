//AWS-AMPLIFY
import { API } from 'aws-amplify';


import {
    onCreateGraph,
    onDeleteGraph,
    onEditGraph
} from '../../graphql/subscriptions';


export const subscribeOnGraph = (fetchFunction) => {
    API.graphql({ query: onCreateGraph })
    .subscribe({
        next: () => { fetchFunction(); }
    });

    API.graphql({ query: onDeleteGraph })
    .subscribe({
        next: () => { fetchFunction(); }
    });

    API.graphql({ query: onEditGraph })
    .subscribe({
        next: () => { fetchFunction(); }
    });
}