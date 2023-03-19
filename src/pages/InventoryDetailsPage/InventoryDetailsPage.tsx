import {Box, Text} from "grommet";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {getTokenERC1155Assets, getTokenERC1155Balances, getTokenERC721Assets} from "src/api/client";
import {IUserERC721Assets} from "src/api/client.interface";
import {BasePage} from "src/components/ui";
import {ERC1155, useERC1155Pool} from "src/hooks/ERC1155_Pool";
import {ERC721, useERC721Pool} from "src/hooks/ERC721_Pool";
import styled from "styled-components";
import HarmonyLogo from '../../assets/Logo.svg';
import { config } from '../../config'
import {ERC1155Icon} from "../../components/ui/ERC1155Icon";
import dayjs from "dayjs";

const AddressLink = styled.a`
  text-decoration: none;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`

interface NFTImageProps {
  imageUrl: string
}

const Image = styled.img`
  width: 100%;
  height: 100%;
  max-width: 100%;
  max-height: 100%;
  margin-left: auto;
  margin-right: auto;
  border-radius: 0.35rem;
`

const ImageContainer = styled(Box)`
  background-color: #f1f2f3;
  width: 100%;
  border-radius: 0.35rem;
`

const NFTContainer = styled(Box)`
  min-width: 300px;

  @media (min-width: 768px) {
    width: 42%;
  }
`

const DetailsWrapper = styled(Box)`
  margin-top: 32px;
  width: 100%;

  @media (min-width: 768px) {
    margin-top: 0;
    width: 56%;
  }
`

const NFTImage = (props: NFTImageProps) => {
  const { imageUrl } = props

  const [isLoading, setIsLoading] = useState(true)
  const [isLoadingError, setLoadingError] = useState(false)

  const onLoadSuccess = () => {
    setIsLoading(false)
  }

  const onLoadError = () => {
    // setIsLoading(false);
    setLoadingError(true);
  }

  return <ImageContainer width={'inherit'} height={'inherit'} justify={'center'} align={'center'}>
    {isLoading &&
        <Image src={HarmonyLogo} style={{ height: '50%' }} />
    }
    <Image
      src={imageUrl}
      onLoad={onLoadSuccess}
      onError={onLoadError}
      style={{ display: isLoading ? 'none': 'block' }}
    />
  </ImageContainer>
}

interface NFTInfoProps {
  tokenERC721: ERC721
  tokenERC1155: ERC1155
  asset: IUserERC721Assets
  tokenOwnerAddress: string
}

const DetailsProp = styled(Box)`
  width: 30%;
  min-width: 30%;
  max-width: 300px;
`

const DetailsRow = styled(Box)`
  flex-direction: row;
`

const Attribute = styled(Box)`
  width: calc(25% - 16px);
  min-width: 100px;
  border-radius: 12px;
  padding: 16px;
  margin-top: 16px;
  text-align: center;
  
  &:not(:last-child) {
    margin-right: 16px;
  }
`

const NFTDetails = (props: NFTInfoProps) => {
  const { tokenERC721, tokenERC1155, asset, tokenOwnerAddress } = props

  const token = tokenERC721 || tokenERC1155 || {}
  const meta = asset.meta || {} as any
  const metaImage = meta?.image ? meta?.image : ''
  const classification = metaImage?.includes('google') ? 'GCP': 'IPFS'

  return <Box round={'8px'} border={{ color: 'border' }} style={{ boxShadow: '0 0.5rem 1.2rem rgb(189 197 209 / 20%)' }}>
    <Box pad={'16px'} border={{ side: 'bottom' }}>
      <Text weight={'bold'}>Details</Text>
    </Box>
    <Box pad={'16px'} border={{ side: 'bottom'}} gap={'16px'}>
      <DetailsRow>
        <DetailsProp>
          <Text size={'small'}>Owner:</Text>
        </DetailsProp>
        <Box>
          <AddressLink href={`/address/${tokenOwnerAddress}`}>
            <Text color={'brand'} size={'small'}>{tokenOwnerAddress}</Text>
          </AddressLink>
        </Box>
      </DetailsRow>
      <DetailsRow>
        <DetailsProp>
          <Text size={'small'}>Contract Address:</Text>
        </DetailsProp>
        <Box>
          <AddressLink href={`/address/${token.address}`}>
            <Text color={'brand'} size={'small'}>{token.address}</Text>
          </AddressLink>
        </Box>
      </DetailsRow>
      {/*<DetailsRow>*/}
      {/*  <DetailsProp>*/}
      {/*    <Text size={'small'}>Classification:</Text>*/}
      {/*  </DetailsProp>*/}
      {/*  <Box>*/}
      {/*    <Text size={'small'}>Off-Chain ({classification})</Text>*/}
      {/*  </Box>*/}
      {/*</DetailsRow>*/}
      <DetailsRow>
        <DetailsProp>
          <Text size={'small'}>Token ID:</Text>
        </DetailsProp>
        <Box>
          <Text size={'small'} style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{asset.tokenID}</Text>
        </Box>
      </DetailsRow>
      <DetailsRow>
        <DetailsProp>
          <Text size={'small'}>Token Standard:</Text>
        </DetailsProp>
        <Box>
          <Text size={'small'}>{tokenERC721 ? 'ERC721' : 'ERC1155'}</Text>
        </Box>
      </DetailsRow>
    </Box>
    <Box pad={'16px'} border={{ side: 'bottom' }}>
      <Text weight={'bold'}>Description</Text>
    </Box>
    <Box pad={'16px'}>
      {asset.meta?.description}
    </Box>
    {meta.attributes &&
      <Box border={{ side: 'top' }}>
          <Box pad={'16px'} border={{ side: 'bottom' }}>
              <Text weight={'bold'}>Attributes</Text>
          </Box>
          <Box pad={'0px 24px 16px'} wrap={true} direction={'row'}>
            {Object.values(meta.attributes).map((attr: any, index: number) => {
              const { trait_type, display_type } = attr

              const value = display_type === 'date'
                ? dayjs(+attr.value).format('MMM DD, YYYY')
                : attr.value
              const valueTitle = display_type === 'date'
                ? dayjs(+attr.value).format('MMM DD, YYYY HH:mm:ss')
                : attr.value

              return <Attribute key={index} border={{ color: 'border' }} background={'backgroundDropdownItem'}>
                <Text size={'small'} color={'brand'} weight={'bold'}>{trait_type}</Text>
                <Text size={'small'} title={valueTitle}>{value}</Text>
              </Attribute>
            })}
          </Box>
      </Box>
    }
  </Box>
}

const NFTInfo = (props: NFTInfoProps) => {
  const { tokenERC721, tokenERC1155, asset } = props
  const { meta } = asset

  const token = tokenERC721 || tokenERC1155 || {}
  const name = token.name || '';
  const erc1155Image = tokenERC1155 && tokenERC1155.meta ? tokenERC1155.meta.image : ''

  return <Box>
    <Box>
      <Box>
        <Text weight={'bold'} size={'large'}>{name} {meta?.name || ""}</Text>
      </Box>
      <Box direction={'row'} align={'center'} gap={'12px'} margin={{ top: '4px' }}>
        <ERC1155Icon imageUrl={erc1155Image} />
        <AddressLink href={`/address/${token.address}`}>
          <Text color={'brand'} size={'small'}>{token.name}</Text>
        </AddressLink>
      </Box>
      <Box margin={{ top: '24px' }}>
        <NFTDetails {...props} />
      </Box>
    </Box>
  </Box>
}

export function InventoryDetailsPage() {
  const erc721Map = useERC721Pool();
  const erc1155Map = useERC1155Pool();
  const [inventory, setInventory] = useState<IUserERC721Assets>({} as any);
  const [tokenOwnerAddress, setTokenOwnerAddress] = useState(''); // TODO: create API to get all  token props in one request

  //  @ts-ignore
  const { address, tokenID, type } = useParams();

  const token721 = erc721Map[address]
  const token1155 = erc1155Map[address]

  useEffect(() => {
    const loadData = async () => {
      try {
        if (type === "erc721" || type === "erc1155") {
          let inventoryItems =
            type === "erc721"
              ? await getTokenERC721Assets([address])
              : await getTokenERC1155Assets([address]);
          const inventoryItem = inventoryItems.filter((item) => item.tokenID === tokenID)[0]

          if(type === 'erc1155') {
            const balances = await getTokenERC1155Balances([address]);
            const userBalance = balances.find((b) => b.tokenID === inventoryItem.tokenID)
            if(userBalance) {
              setTokenOwnerAddress(userBalance.ownerAddress)
            }
          }
          setInventory(inventoryItem);
        }
      } catch (e) {
        console.error('Cannot load token data:', e)
      }
    };
    loadData();
  }, [address]);

  // let meta = "";
  // try {
  //   meta = JSON.stringify(inventory.meta, null, 4);
  // } catch {
  //   meta = "";
  // }

  const metaImageUrl = inventory.meta?.image || ''
  const imageUrl = metaImageUrl.includes('http') ? metaImageUrl : `${config.ipfsGateway}${metaImageUrl}`

  return (
    <>
      <BasePage>
        <Box direction={'row'} justify={'between'} wrap={true}>
          <NFTContainer>
            <NFTImage imageUrl={imageUrl} />
          </NFTContainer>
          <DetailsWrapper>
            <NFTInfo
              tokenERC721={token721}
              tokenERC1155={token1155}
              asset={inventory}
              tokenOwnerAddress={tokenOwnerAddress}
            />
          </DetailsWrapper>
        </Box>
      </BasePage>
    </>
  );
}
