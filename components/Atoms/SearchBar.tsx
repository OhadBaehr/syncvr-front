import { ActionIcon, Input, InputProps } from "@mantine/core";
import { IconSearch } from "@tabler/icons-react";


type SearchBarProps = InputProps & React.HTMLAttributes<HTMLInputElement> & {
    currentNumber: number
    totalNumber: number
    searchingFor: string
}

export function SearchBar({ onChange, currentNumber, totalNumber, searchingFor}: SearchBarProps) {
    return (
        <Input.Wrapper label={`${currentNumber}/${totalNumber} Displayed`}>
            <Input
                w={'100%'}
                onChange={onChange}
                leftSection={
                    <ActionIcon variant="subtle">
                        <IconSearch />
                    </ActionIcon>
                }
                styles={{ input: { borderRadius: 300, width: 280 } }}
                placeholder={`Search for a ${searchingFor}...`}
            />
        </Input.Wrapper>
    )
}