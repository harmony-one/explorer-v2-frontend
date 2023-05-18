import {useEffect, useState} from 'react'
import { StatPage } from './StatPage';
import { hmyv2_getNodeMetadata } from 'src/api/rpc';
import { config } from 'src/config';

export const ViewChangeMetric = () => {
    const { availableShards } = config
    const [items, setItems] = useState<any[]>([])
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [loadingError, setLoadingError] = useState('')
    const [totalViewChange, setTotalViewChange] = useState(0)

    useEffect(() => {
        const loadData = async () => {
            try {
                setIsLoading(true) 
                for (let i in availableShards) {
                    const nodeMetadata = await hmyv2_getNodeMetadata(i)
                    const blockHeight = nodeMetadata['consensus']['blocknum']
                    const viewId = nodeMetadata['consensus']['viewId']
                    const viewChange = viewId - blockHeight
                    setItems(items => [...items, {
                        viewChange: viewChange,
                        viewId: viewId,
                        blockHeight: blockHeight,
                    }])
                    setTotalViewChange(totalViewChange => totalViewChange + viewChange)
                }             
            } catch (e) {
                console.error('Error on loading metrics:', e)
                setLoadingError('Loading error')
            } finally {
                setIsLoading(false)
            }
        }
        loadData()
    }, [])

    const viewChangeProps = {
        title: 'Harmony View Change Metric',
        description: '',
        items: items,
        keys: ['viewChange', 'viewId', 'blockHeight'],
        isLoading,
        loadingError,
        value: `A total of ${totalViewChange} view changes have occurred across ${availableShards.length} shards`,
    }

    return <StatPage {...viewChangeProps} />
}
