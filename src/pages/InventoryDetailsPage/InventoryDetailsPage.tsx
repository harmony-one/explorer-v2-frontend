import {Box, Text} from "grommet";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getTokenERC1155Assets, getTokenERC721Assets } from "src/api/client";
import { IUserERC721Assets } from "src/api/client.interface";
import {Address, BasePage} from "src/components/ui";
import {ERC1155, useERC1155Pool} from "src/hooks/ERC1155_Pool";
import {ERC721, useERC721Pool} from "src/hooks/ERC721_Pool";
import styled from "styled-components";
import HarmonyLogo from '../../assets/Logo.svg';
import { config } from '../../config'
import {ERC1155Icon} from "../../components/ui/ERC1155Icon";

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
`

const NFTContainer = styled(Box)`
  min-width: 300px;

  @media (min-width: 768px) {
    width: 42%;
  }
`

const DetailsWrapper = styled(Box)`
  margin-top: 32px;

  @media (min-width: 768px) {
    width: 58%;
    margin-top: 0;
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
        <Image src={HarmonyLogo} style={{ width: '50%' }} />
    }
    <Image
      color={'red'}
      src={`${config.ipfsGateway}${imageUrl}`}
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
}

const DetailsProp = styled(Box)`
  width: 30%;
  max-width: 300px;
  min-width: 140px;
`

const DetailsRow = styled(Box)`
  flex-direction: row;
`

const NFTDetails = (props: NFTInfoProps) => {
  const { tokenERC721, tokenERC1155, asset } = props

  const token = tokenERC721 || tokenERC1155 || {}
  console.log('token', token)
  console.log('asset', asset)

  return <Box round={'8px'} border={{ color: 'border' }} style={{ boxShadow: '0 0.5rem 1.2rem rgb(189 197 209 / 20%)' }}>
    <Box pad={'16px'} border={{ side: 'bottom' }}>
      <Text weight={'bold'}>Details</Text>
    </Box>
    <Box pad={'16px'} border={{ side: 'bottom'}} gap={'16px'}>
      <DetailsRow>
        <DetailsProp>
          <Text size={'small'}>Owner:</Text>
        </DetailsProp>
        <Box>{asset.ownerAddress}</Box>
      </DetailsRow>
      <DetailsRow>
        <DetailsProp><Text size={'small'}>Contract Address:</Text></DetailsProp>
        <Box>
          <Address address={token.address} />
        </Box>
      </DetailsRow>
      <DetailsRow>
        <DetailsProp><Text size={'small'}>Classification:</Text></DetailsProp>
        <Box>
          <Text size={'small'}>Off-Chain (IPFS)</Text>
        </Box>
      </DetailsRow>
      <DetailsRow>
        <DetailsProp><Text size={'small'}>Token ID:</Text></DetailsProp>
        <Box>
          <Text size={'small'} style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{asset.tokenID}</Text>
        </Box>
      </DetailsRow>
      <DetailsRow>
        <DetailsProp><Text size={'small'}>Token Standard:</Text></DetailsProp>
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
  </Box>
}

const NFTInfo = (props: NFTInfoProps) => {
  const { tokenERC721, tokenERC1155, asset } = props
  const { meta } = asset

  const token = tokenERC721 || tokenERC1155 || {}
  const name = token.name || '';
  const erc1155Image = tokenERC1155 && tokenERC1155.meta ? tokenERC1155.meta.image : ''

  return <Box pad={{ left: 'medium' }}>
    <Box>
      <Box>
        <Text weight={'bold'} size={'large'}>{name} {meta?.name || ""}</Text>
      </Box>
      <Box direction={'row'} align={'center'} gap={'12px'} margin={{ top: '4px' }}>
        <ERC1155Icon imageUrl={erc1155Image} />
        <Address address={token.address} hideCopyBtn={true} />
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

  //  @ts-ignore
  const { address, tokenID, type } = useParams();

  const token721 = erc721Map[address]
  const token1155 = erc1155Map[address]

  useEffect(() => {
    const getInventory = async () => {
      try {
        if (type === "erc721" || type === "erc1155") {
          let inventory =
            type === "erc721"
              ? await getTokenERC721Assets([address])
              : await getTokenERC1155Assets([address]);

          setInventory(inventory.filter((item) => item.tokenID === tokenID)[0]);
        } else {
          setInventory({} as any);
        }
      } catch (err) {
        setInventory({} as any);
      }
    };
    getInventory();
  }, [address]);

  let meta = "";
  try {
    meta = JSON.stringify(inventory.meta, null, 4);
  } catch {
    meta = "";
  }

  return (
    <>
      <BasePage>
        <Box direction={'row'} justify={'start'} wrap={true}>
          <NFTContainer>
            <NFTImage imageUrl={inventory.meta?.image || ''} />
          </NFTContainer>
          <DetailsWrapper>
            <NFTInfo tokenERC721={token721} tokenERC1155={token1155} asset={inventory} />
          </DetailsWrapper>
        </Box>
      </BasePage>
    </>
  );
}
