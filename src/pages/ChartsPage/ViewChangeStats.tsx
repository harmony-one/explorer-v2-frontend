import {useEffect, useState} from 'react'
import { StatPage } from './StatPage';
import { hmyv2_getNodeMetadata } from 'src/api/rpc';
import { config } from 'src/config';

const CONSENSUS = "consensus"
const BLOCK_NUM = "blocknum"
const VIEW_ID = "viewId"

export const ViewChangeStats = () => {
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
                    const blockHeight = nodeMetadata[CONSENSUS][BLOCK_NUM]
                    const viewId = nodeMetadata[CONSENSUS][VIEW_ID]
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
        title: 'Harmony View Change Statistics',
        description: '',
        items: items,
        keys: ['viewChange', 'viewId', 'blockHeight'],
        isLoading,
        loadingError,
        infoLeft: `Total of ${totalViewChange} view changes across ${availableShards.length} shards`,
        infoRight: 'Data is obtained from the explorer node, which may result in a slight delay'
    }

    return <StatPage {...viewChangeProps} />
}
